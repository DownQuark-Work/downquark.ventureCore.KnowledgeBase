// deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 17 -c 17 -s 13 --anim 100 --sdwndr)
// deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 17 -c 17 -s 1369 --anim 100 --sdwndr)

import {parseSeed, parsedVerifiedValue, seedPointer} from '../../_utils/_seed.ts'
import {CELL_DIRECTIONS_MAP, CELL_STATE, RENDER_MAZE_AS, SHOW_ANIMATION} from './_settings.ts'
import {renderGridPassage} from './_utils.ts'

let mazeGeneratorReturnObject = {
      Algorithm: RENDER_MAZE_AS.BACKTRACKER,
      AnimationDuration: 0,
      Egress:{Enter:[0,0],Exit:[0,0]},
      Grid: { amtColumn: 0, amtRow: 0 },
      Maze: [[0]],
      Type: RENDER_MAZE_AS.PASSAGE,
      Seed: 0,
      SeedVerification: 0
    },
    _ANIMATION_DURATION = 0,
    Maze:number[][]

const markEggress = () => {
  const {Enter,Exit} =  mazeGeneratorReturnObject.Egress
  Maze[Enter[0]][Enter[1]] = CELL_STATE.EGGRESS.ENTER
  Maze[Exit[0]][Exit[1]] = CELL_STATE.EGGRESS.EXIT
}
const createEgress = () => {
  const colAmt = mazeGeneratorReturnObject.Grid.amtColumn,
        rowAmt = mazeGeneratorReturnObject.Grid.amtRow,
        denomCol = 10 / (colAmt-2), // -2 for borders
        denomRow = 10 / (rowAmt-2)

  const getLocation = (wall:string) => {
    seedPointer.inc()
    
    const initialLoc = (wall.charAt(wall.length-1) === 'T')
          ? Math.min(Math.max(Math.round(seedPointer()/denomCol) + 1,1), colAmt-1)
          : Math.min(Math.max(Math.round(seedPointer()/denomRow) + 1,1), rowAmt-1)
    let colCheck = colAmt - 2,
        rowCheck = 1
    switch(wall) {
      case 'LEFT': 
        colCheck = 1
        /* falls through */
      case 'RIGHT':
        rowCheck = initialLoc
        while(rowCheck && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) rowCheck--
        if(!rowCheck) {
          while(rowCheck < rowAmt - 1 && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) rowCheck++
        }
        return [rowCheck, colCheck === 1 ? 0 : colAmt - 1]
      case 'BOTTOM':
        rowCheck = rowAmt - 2
        /* falls through */
      case 'TOP':
      default:
        colCheck = initialLoc
        while(colCheck && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) colCheck--
        if(!colCheck) {
          while(colCheck < rowAmt - 1 && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) colCheck++
        }
        return [rowCheck === 1 ? 0 : rowAmt - 1, colCheck]
    }
  }

  while( seedPointer() > 7) // 8 & 9 would cause bias towards BOTTOM LEFT
  { seedPointer.inc() }

  const entWall = CELL_DIRECTIONS_MAP[seedPointer()%4]
  seedPointer.inc()
  const exWall = CELL_DIRECTIONS_MAP[seedPointer()%4] === entWall ? CELL_DIRECTIONS_MAP[(seedPointer()+1)%4] : CELL_DIRECTIONS_MAP[seedPointer()%4] // ensures not the entrance wall
  seedPointer.inc()
  const entLoc = getLocation(entWall)
  const exLoc = getLocation(exWall)

  // renderGridPassage(Maze)
  console.log('denomCol,denomRow', denomCol,denomRow)
  console.log('entWall, exWall', entWall, exWall)
  console.log('entLoc', entLoc, exLoc)
  mazeGeneratorReturnObject.Egress = {Enter:[0,3], Exit:[8,0]}
  Maze[entLoc[0]][entLoc[1]] = CELL_STATE.EGGRESS.ENTER
  Maze[exLoc[0]][exLoc[1]] = CELL_STATE.EGGRESS.EXIT
  renderGridPassage(Maze)
    // mazeGeneratorReturnObject.Egress = {Enter:entPt, Exit:exPt}
    markEggress()
}

const updateInitialRow = () => {
  Maze[0] = new Array(Maze[0].length).fill(CELL_STATE.COMMON.NON_CONSIDERED)
  Maze[2].forEach((c,i) => {
    if(i && i < mazeGeneratorReturnObject.Grid.amtColumn-1 && c === CELL_STATE.COMMON.NON_CONSIDERED) {
      if (i-1 > 0) { Maze[1][i-1] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH }
      Maze[1][i] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
      if (i+1 < mazeGeneratorReturnObject.Grid.amtColumn-1) { Maze[1][i+1] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH }
    }
  })
  seedPointer.inc()
}

let _pathAcitve:Array<number[]> = [] // initial point
const carveNorth = () => {
  let carveCol = _pathAcitve[seedPointer.inc() % _pathAcitve.length][1]
  const carveRow = _pathAcitve[0][0]-1
  
  if(_pathAcitve.length > 1) { // only look if other options are available - ensures paths will always be accessible
    while(carveCol > _pathAcitve[0][1] && Maze[carveRow-1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) carveCol--
    if(Maze[carveRow-1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) { // no carvable path found - check other direction
      while(carveCol < _pathAcitve[_pathAcitve.length-1][1] && Maze[carveRow-1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) carveCol++
      if(Maze[carveRow-1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) { // no carvable path found in either direction
        Maze[carveRow+1][_pathAcitve[0][1]-1] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH // - attach to lefthand point to ensure no floating routes
      }
    }
  }

  Maze[carveRow][carveCol] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
  _pathAcitve = [] // reset
}
const carveSidewinderMaze = (pt:number[]) => {
  if(pt[0]+1 >= mazeGeneratorReturnObject.Grid.amtRow) {
    updateInitialRow()
    createEgress()
    mazeGeneratorReturnObject.Maze = Maze
    console.log(JSON.stringify(mazeGeneratorReturnObject)) // CLI
    return mazeGeneratorReturnObject // BROWSER
  }
  Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT
  _pathAcitve.push(pt)
  _ANIMATION_DURATION && renderGridPassage(Maze)

  setTimeout(()=>{
    Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
    if(pt[1]+2 === mazeGeneratorReturnObject.Grid.amtColumn || !(seedPointer.inc()%4)) {
      carveNorth()
      pt[1]+4 >= mazeGeneratorReturnObject.Grid.amtColumn // End of row -> `+4` ensures no hanging routes
        ? carveSidewinderMaze([pt[0]+2,1]) // next row
        : carveSidewinderMaze([pt[0],pt[1]+2]) // skip tile and continue
    }
    else {
      carveSidewinderMaze([pt[0],pt[1]+1])
    }
  },_ANIMATION_DURATION)
}

const generateMaze = (_maze:number[][]) => {
  Maze = _maze
  carveSidewinderMaze([2,1]) // initial sidewinder position
}

const instantiate = (base:typeof mazeGeneratorReturnObject) => {
  seedPointer(0)
  const { _flatGrid } = (base.Grid as { amtColumn: number, amtRow: number, _flatGrid:number[][]})
  delete (base.Grid as { amtColumn: number, amtRow: number, _flatGrid?:number[][]})._flatGrid
  parseSeed(base.Seed,((base.Grid.amtColumn*base.Grid.amtRow) + base.Grid.amtRow)) // + base.Grid.amtRow is safety buffer
  seedPointer.inc() // needed to instantiate seed parsing
  mazeGeneratorReturnObject = {
    ...base,
    SeedVerification: parsedVerifiedValue()
  }
  _ANIMATION_DURATION = [mazeGeneratorReturnObject.AnimationDuration?.valueOf(), SHOW_ANIMATION].sort().pop() || 0
  generateMaze(_flatGrid)
}

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const setMazeProps = (base:typeof mazeGeneratorReturnObject) => { instantiate(base) } // Browser
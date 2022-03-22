// deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 17 -c 17 -s 13 --anim 100 --sdwndr)
// deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 17 -c 17 -s 1369 --anim 100 --sdwndr)
// LARGER: deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 30 -c 25 -s 1369 --sdwndr) 
// LARGER: deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 20 -c 35 -s 1313 --sdwndr)

import {parseSeed, parsedVerifiedValue, seedPointer} from '../../_utils/_seed.ts'
import {CELL_STATE, RENDER_MAZE_AS, SHOW_ANIMATION} from './_settings.ts'
import {createEgress, renderGridPassage} from './_utils.ts'

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
  _ANIMATION_DURATION && renderGridPassage(Maze)
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
    }
  }

  if(Maze[carveRow-1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) { // no carvable path found in either direction
    Maze[carveRow+1][_pathAcitve[0][1]-1] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH // - attach to lefthand point to ensure no floating routes
  }

  Maze[carveRow][carveCol] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH

  _pathAcitve = [] // reset
}
const carveSidewinderMaze = (pt:number[]) => {
  if(pt[0]+1 >= mazeGeneratorReturnObject.Grid.amtRow) {
    updateInitialRow()
    mazeGeneratorReturnObject.Egress = createEgress(mazeGeneratorReturnObject.Algorithm, {Grid:mazeGeneratorReturnObject.Grid, Maze, seedPointer})
    markEggress()
    mazeGeneratorReturnObject.Maze = Maze
    if (typeof Deno !== 'undefined') { console.log(JSON.stringify(mazeGeneratorReturnObject)) } // CLI
    return // mazeGeneratorReturnObject // BROWSER
  }
  Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT
  _pathAcitve.push(pt)
  _ANIMATION_DURATION && renderGridPassage(Maze)

  setTimeout(()=>{
    Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH
    if(pt[1]+2 === mazeGeneratorReturnObject.Grid.amtColumn || !(seedPointer.inc()%4)) {
      carveNorth()
      pt[1]+3 >= mazeGeneratorReturnObject.Grid.amtColumn // End of row -> `+3` ensures no floating routes
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
export const generateSidewinder = (base:typeof mazeGeneratorReturnObject) => {
  instantiate(base)
  return mazeGeneratorReturnObject
} // Browser
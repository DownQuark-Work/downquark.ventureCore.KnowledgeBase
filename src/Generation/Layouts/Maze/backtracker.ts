// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313)
// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 17 -t RENDER_MAZE_AS.WALLED -s 42)
import {parseSeed, parsedVerifiedValue} from '../../_utils/_seed.ts'
import {CELL_DIRECTIONS_MAP, CELL_STATE} from './_settings.ts'
import {renderGridPassage} from './_utils.ts'

let backtrackerReturnObject = {
      Egress:{Enter:[0,0],Exit:[0,0]},
      Grid: { amtColumn: 0, amtRow: 0 },
      Type: "RENDER_MAZE_AS.PASSAGE",
      Seed: 0,
      SeedVerification: 0
    },
    parsedMazeSeed:number[],
    seedPointer = 0,
    parseedSeedPointer = 0,
    Maze:number[][]
    
const stepUp = () => {
  if(++seedPointer >= parsedMazeSeed.length) seedPointer = 0
  parseedSeedPointer = parsedMazeSeed[seedPointer]
}

const createEgress = () => {
  const colAmt = backtrackerReturnObject.Grid.amtColumn,
        rowAmt = backtrackerReturnObject.Grid.amtRow,
        restraintColAmt = colAmt - Math.floor(colAmt/2.1),
        restraintRowAmt = rowAmt - Math.floor(rowAmt/2.1),
        denomCol = 10 / colAmt,
        denomRow = 10 / rowAmt,
        denomRestraintCol = 10 / restraintColAmt,
        denomRestraintRow = 10 / restraintRowAmt,
        mazeBounds:{[k:string]:number} = {
          BOTTOM: rowAmt-1,
          LEFT: 0,
          RIGHT: colAmt-1,
          TOP: 0,
        }

  while( parseedSeedPointer > 7) // 8 & 9 would cause bias towards BOTTOM LEFT
  { stepUp() }

  const entWall = CELL_DIRECTIONS_MAP[parseedSeedPointer%4]
  stepUp()
  let entLoc = (entWall.charAt(entWall.length-1) === 'T') ? Math.floor(parseedSeedPointer/denomRow) : Math.floor(parseedSeedPointer/denomCol) // charAt matches LEFT || RIGHT
  if (entLoc%2==0){ entLoc = Math.max(entLoc--,1) } // location must be odd and positive
  stepUp()
  const exWall = CELL_DIRECTIONS_MAP[parseedSeedPointer%4] === entWall ? CELL_DIRECTIONS_MAP[(parseedSeedPointer+1)%4] : CELL_DIRECTIONS_MAP[parseedSeedPointer%4] // ensures not the entrance wall
  stepUp()
  const exitConstraints = (
      exWall.charAt(exWall.length-1) !== entWall.charAt(entWall.length-1) // lefT righT
      && exWall.charAt(1) !== entWall.charAt(1) // tOp bOttom
    )
    ? exWall.charAt(exWall.length-1) === 'T' ? -denomRestraintRow : -denomRestraintCol
    : exWall.charAt(exWall.length-1) === 'T' ? denomRow : denomCol

  let exLoc = (exitConstraints < 0)
    ? Math.floor(parseedSeedPointer/Math.abs(exitConstraints) + Math.floor(Math.min(restraintColAmt,restraintRowAmt)/2))
    : Math.floor(parseedSeedPointer/exitConstraints)
    if (exLoc%2==0){ Math.max(exLoc--,1) } // location must be odd and positive
    
    const entPt = (entWall.charAt(entWall.length-1) === 'T') ? [entLoc,mazeBounds[entWall]] : [mazeBounds[entWall],entLoc]
    const exPt = (exWall.charAt(exWall.length-1) === 'T') ? [exLoc,mazeBounds[exWall]] : [mazeBounds[exWall],exLoc]
    backtrackerReturnObject.Egress = {Enter:entPt, Exit:exPt}
    // console.log('backtrackerReturnObject.Egress', backtrackerReturnObject.Egress)
    Maze[entPt[0]][entPt[1]] = CELL_STATE.EGGRESS.ENTER
    Maze[exPt[0]][exPt[1]] = CELL_STATE.EGGRESS.EXIT
}

const _pathAcitve = []
const carveMaze = (pt:number[],offset=2) => {
  const _considerations:number[][] = []
  if(offset !== 1){ // leave Entrance tile as-is
    Maze[pt[0]][pt[1]] = CELL_STATE['RENDER_MAZE_AS.PASSAGE'].IN_PATH
  }
  _pathAcitve.push(pt)
  const surroundingPts = {
    d:[pt[0]+offset,pt[1]],
    l:[pt[0],pt[1]-offset],
    r:[pt[0],pt[1]+offset],
    u:[pt[0]-offset,pt[1]]
  }
  const d = surroundingPts.d[0] < backtrackerReturnObject.Grid.amtRow ? Maze[pt[0]+offset][pt[1]] : null
  const l = surroundingPts.l[1] >= 0 ? Maze[pt[0]][pt[1]-offset] : null
  const r = surroundingPts.r[1] < backtrackerReturnObject.Grid.amtColumn ? Maze[pt[0]][pt[1]+offset] : null
  const u = surroundingPts.u[0] >= 0 ? Maze[pt[0]-offset][pt[1]] : null

  console.log('surroundingPts', surroundingPts)
  console.log('u,d,l,r', u,d,l,r)

  d === CELL_STATE['RENDER_MAZE_AS.PASSAGE'].UNCARVED && _considerations.push(surroundingPts.d)
  l === CELL_STATE['RENDER_MAZE_AS.PASSAGE'].UNCARVED && _considerations.push(surroundingPts.l)
  r === CELL_STATE['RENDER_MAZE_AS.PASSAGE'].UNCARVED && _considerations.push(surroundingPts.r)
  u === CELL_STATE['RENDER_MAZE_AS.PASSAGE'].UNCARVED && _considerations.push(surroundingPts.u)

  console.log('_considerations', _considerations)
  _considerations.forEach(c => { Maze[c[0]][c[1]] = CELL_STATE.COMMON.CONSIDER })

  console.log('Maze', Maze)
  renderGridPassage(Maze)
  console.log('carveMaze, pt', pt)
  if(_pathAcitve.length == 1){ carveMaze(_considerations[0]) }
}

const generateBacktracker = (_maze:number[][]) => {
  Maze = _maze
  createEgress()
  carveMaze(backtrackerReturnObject.Egress.Enter,1) // Walk the path - Do the thing
  // Return the Maze
}

const instantiate = (base:any) => {
  seedPointer = 0
  const { _flatGrid } = base.Grid
  delete base.Grid._flatGrid
  const strParsedSeed = parseSeed(base.Seed,((base.Grid.amtColumn*base.Grid.amtRow) + base.Grid.amtRow)) // + base.Grid.amtRow is safety buffer
  parsedMazeSeed = strParsedSeed.map(str => parseInt(str,10))
  // parsedMazeSeed = [8,8,8,8,9,9,9,8,9, ...parsedMazeSeed]
  stepUp() // needed to instantiate seed parsing
  backtrackerReturnObject = {
    ...base,
    SeedVerification: parsedVerifiedValue()
  }
  console.log('ret', backtrackerReturnObject, parsedMazeSeed)
  
  generateBacktracker(_flatGrid)
}

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const setMazeProps = (base:any) => { instantiate(base) } // Browser
// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313)
// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -t RENDER_MAZE_AS.WALLED -s 42)
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
    Maze:number[][]

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

  while( parsedMazeSeed[seedPointer] > 7) // 8 & 9 would cause bias towards BOTTOM LEFT
  { seedPointer++ }

  const entWall = CELL_DIRECTIONS_MAP[parsedMazeSeed[seedPointer]%4]
  seedPointer++
  const entLoc = (entWall.charAt(entWall.length-1) === 'T') ? Math.floor(parsedMazeSeed[seedPointer]/denomRow) : Math.floor(parsedMazeSeed[seedPointer]/denomCol) // charAt matches LEFT || RIGHT
  seedPointer++
  const exWall = CELL_DIRECTIONS_MAP[parsedMazeSeed[seedPointer]%4] === entWall ? CELL_DIRECTIONS_MAP[(parsedMazeSeed[seedPointer]+1)%4] : CELL_DIRECTIONS_MAP[parsedMazeSeed[seedPointer]%4] // ensures not the entrance wall
  seedPointer++
  const exitConstraints = (
      exWall.charAt(exWall.length-1) !== entWall.charAt(entWall.length-1) // lefT righT
      && exWall.charAt(1) !== entWall.charAt(1) // tOp bOttom
    )
    ? exWall.charAt(exWall.length-1) === 'T' ? -denomRestraintRow : -denomRestraintCol
    : exWall.charAt(exWall.length-1) === 'T' ? denomRow : denomCol

  const exLoc = (exitConstraints < 0)
    ? Math.floor(parsedMazeSeed[seedPointer]/Math.abs(exitConstraints) + Math.floor(Math.min(restraintColAmt,restraintRowAmt)/2))
    : Math.floor(parsedMazeSeed[seedPointer]/exitConstraints)

  const entPt = (entWall.charAt(entWall.length-1) === 'T') ? [entLoc,mazeBounds[entWall]] : [mazeBounds[entWall],entLoc]
  const exPt = (exWall.charAt(exWall.length-1) === 'T') ? [exLoc,mazeBounds[exWall]] : [mazeBounds[exWall],exLoc]
  backtrackerReturnObject.Egress = {Enter:entPt, Exit:exPt}
  Maze[entPt[0]][entPt[1]] = CELL_STATE.EGGRESS.ENTER
  Maze[exPt[0]][exPt[1]] = CELL_STATE.EGGRESS.EXIT
  // console.log('backtrackerReturnObject', backtrackerReturnObject)
  renderGridPassage(Maze)
  
}

const carveMaze = () => {
  
}

const generateBacktracker = (_maze:number[][]) => {
  Maze = _maze
  console.log('Maze', Maze)
  console.log('make all mutations needed to the `Maze` object .. the fun part is back')
  createEgress()
  carveMaze()
  // Walk the path - Do the thing
  // Return the Maze
}

const instantiate = (base:any) => {
  seedPointer = 3
  const { _flatGrid } = base.Grid
  delete base.Grid._flatGrid
  const strParsedSeed = parseSeed(base.Seed,((base.Grid.amtColumn*base.Grid.amtRow) + base.Grid.amtRow)) // + base.Grid.amtRow is safety buffer
  parsedMazeSeed = strParsedSeed.map(str => parseInt(str,10))
  backtrackerReturnObject = {
    ...base,
    SeedVerification: parsedVerifiedValue()
  }
  console.log('ret', backtrackerReturnObject, parsedMazeSeed)
  
  generateBacktracker(_flatGrid)
}

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const setMazeProps = (base:any) => { instantiate(base) } // Browser
// deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313 --prim --anim 225)
// deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 17 -s 1313 --walled)
// deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 17 -s 42 --anim)
// fun seed: deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1 --anim --prikm) 
// larger: deno run Layouts/Maze/sidewinder.ts $(deno run Layouts/Maze/_base.ts -r 25 -c 30 -s 1369 --anim 100 --prim)

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

  while( seedPointer() > 7) // 8 & 9 would cause bias towards BOTTOM LEFT
  { seedPointer.inc() }

  const entWall = CELL_DIRECTIONS_MAP[seedPointer()%4]
  seedPointer.inc()
  let entLoc = (entWall.charAt(entWall.length-1) === 'T') ? Math.floor(seedPointer()/denomRow) : Math.floor(seedPointer()/denomCol) // charAt matches LEFT || RIGHT
  if (entLoc%2==0){ entLoc = Math.max(entLoc--,1) } // location must be odd and positive
  seedPointer.inc()
  const exWall = CELL_DIRECTIONS_MAP[seedPointer()%4] === entWall ? CELL_DIRECTIONS_MAP[(seedPointer()+1)%4] : CELL_DIRECTIONS_MAP[seedPointer()%4] // ensures not the entrance wall
  seedPointer.inc()
  const exitConstraints = (
      exWall.charAt(exWall.length-1) !== entWall.charAt(entWall.length-1) // lefT righT
      && exWall.charAt(1) !== entWall.charAt(1) // tOp bOttom
    )
    ? exWall.charAt(exWall.length-1) === 'T' ? -denomRestraintRow : -denomRestraintCol
    : exWall.charAt(exWall.length-1) === 'T' ? denomRow : denomCol

  let exLoc = (exitConstraints < 0)
    ? Math.floor(seedPointer()/Math.abs(exitConstraints) + Math.floor(Math.min(restraintColAmt,restraintRowAmt)/2))
    : Math.floor(seedPointer()/exitConstraints)
    if (exLoc%2==0){ Math.max(exLoc--,1) } // location must be odd and positive
    
    const entPt = (entWall.charAt(entWall.length-1) === 'T') ? [entLoc,mazeBounds[entWall]] : [mazeBounds[entWall],entLoc]
    const exPt = (exWall.charAt(exWall.length-1) === 'T') ? [exLoc,mazeBounds[exWall]] : [mazeBounds[exWall],exLoc]
    mazeGeneratorReturnObject.Egress = {Enter:entPt, Exit:exPt}
    markEggress()
}

const _pathAcitve:Array<number[]> = []
const generateMaze = (_maze:number[][]) => {
  Maze = _maze
  // createEgress()
  renderGridPassage(Maze)
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
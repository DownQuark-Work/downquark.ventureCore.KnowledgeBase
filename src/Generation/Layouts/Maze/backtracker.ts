// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313)
// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -t RENDER_MAZE_AS.WALLED -s 42)
import {parseSeed, parsedVerifiedValue} from '../../_utils/_seed.ts'
let backtrackerReturnObject = {},
    parsedMazeSeed

const generateBacktracker = (fGrid:string[][]) => {
  console.log('fGrid', fGrid)
  console.log('backtracker', backtrackerReturnObject)
  console.log(':n')
}

const instantiate = (base:any) => {
  const { _flatGrid } = base.Grid
  delete base.Grid._flatGrid
  console.log('base', base)
  // const Seed = parseSeed(base.Grid.seed,(base.Grid.amtColumn*base.Grid.amtRow))
  parsedMazeSeed = parseSeed(base.Seed,(base.Grid.amtColumn*base.Grid.amtRow))
  backtrackerReturnObject = {
    ...base,
    SeedVerification: parsedVerifiedValue()
  }
  console.log('ret', backtrackerReturnObject, parsedMazeSeed)
  
  generateBacktracker(_flatGrid)
}

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const setMazeProps = (base:any) => { instantiate(base) } // Browser
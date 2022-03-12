// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313)
// deno run Layouts/Maze/backtracker.ts $(deno run Layouts/Maze/_base.ts -r 13 -c 13 -t RENDER_MAZE_AS.WALLED -s 42)
import {parseSeed, parsedVerifiedValue} from '../../_utils/_seed.ts'
let backtrackerReturnObject = {},
    parsedMazeSeed

const generateBacktracker = (Maze:string[][]) => {
  // console.log('backtracker', backtrackerReturnObject)
  console.log('Maze', Maze)
  console.log('make all mutations needed to the `Maze` object .. the fun part is back')
  //Create Egress
  // Walk the path - Do the thing
  // Return the Maze
}

const instantiate = (base:any) => {
  const { _flatGrid } = base.Grid
  delete base.Grid._flatGrid
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
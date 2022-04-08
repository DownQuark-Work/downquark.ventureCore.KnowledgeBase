// deno run Layouts/Grid/_base.ts -r 13 -c 13 -s 1313 --prim --anim 225
// deno run Layouts/Grid/bsp.ts -r 13 -c 13 -s 1313

import {parseSeed, parsedVerifiedValue, seedPointer} from '../../_utils/_seed.ts'

let gridReturnObj = {
  AnimationDuration: 0,
  Dimension: { columns: 0, rows: 0 },
  Grid: [[0]],
  Seed: 0,
  SeedVerification: 0
},
  Grid:number[][]

  const instantiate = (base:typeof gridReturnObj) => {
    console.log('Deno.args[0]', Deno.args)
    seedPointer(0)
    parseSeed(base.Seed,((base.Dimension.columns*base.Dimension.rows) + base.Dimension.rows)) // + base.Dimension.column is safety buffer
    seedPointer.inc() // needed to instantiate seed parsing
    gridReturnObj = {
      ...base,
      SeedVerification: parsedVerifiedValue()
    }
    // init(row,col,walled && SETTINGS.RENDER_MAZE_AS.WALLED,seed) 
    console.log('BSP:', base.Dimension.columns*base.Dimension.rows,base.Dimension.columns*base.Dimension.columns,base.Seed)
  }

(typeof Deno !== 'undefined') && instantiate(JSON.parse(Deno.args[0])) // CLI
export const generateSidewinder = (base:typeof gridReturnObj) => {
  instantiate(base)
  return gridReturnObj
} // Browser
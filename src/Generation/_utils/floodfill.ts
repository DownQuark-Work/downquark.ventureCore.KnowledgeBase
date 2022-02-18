// deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 13)
import {renderGrid} from './cli-view.ts'

const _DEBUG =false
const FloodFillReturnObject: {
  seedArg?:number,
  verifySeed?:number,
  RoomAmount?:number[],
  RoomEgress?:{[k:string]: number[]},
  FloodFilledAutomata?:Array<Array<string[]>>
} = {RoomAmount:[], RoomEgress:{}}
// const CellularAutomataArguments = JSON.parse(Deno.args[0])
// const grids:Array<Array<string[]>> = CellularAutomataArguments.CellularAutomata
// console.log('grid', grids)

const fill = (g:Array<string[]>,r:number,c:number,n:number) => {
  if(c < 0 || r < 0 || c > g[0].length-1 || r > g.length-1) return
  const cur = g[r][c],
    ff = n+'⊡'+cur // String(n).replace(/1/g,'X') // '⊡'+n+'⫶' + g[r][c]\\\
  if(/⊡/g.test(cur)) return
  if(parseInt(cur,10) < 1) return
  
  g[r][c] = ff

  fill(g,r-1,c,n)
  fill(g,r+1,c,n)
  fill(g,r,c-1,n)
  fill(g,r,c+1,n)
}

const flood = (grd:Array<string[]>) => {
  let curRoom = 0

  for(let row = 0; row < grd.length; row++) {
    for(let column = 0; column < grd[row].length; column++) {
      const cur = grd[row][column]
      if(!/⊡/g.test(cur) && parseInt(cur,10) > 0) {
        fill(grd,row,column,curRoom)
        if (FloodFillReturnObject?.RoomEgress) FloodFillReturnObject.RoomEgress[curRoom] = [row, column]
        curRoom++
      }
    }
  }
  FloodFillReturnObject.RoomAmount?.push(curRoom)
  return grd
}

export const applyFloodFill = (grids:Array<Array<string[]>>) => {
  const grds = [...grids]
  const floodFillGrids = grids.map(grid => flood(grid))
  console.log('floodFillGrids', floodFillGrids)
  returnFloodFilled(floodFillGrids)
  return FloodFillReturnObject
}
const returnFloodFilled = (fFG:any) => {
// this should rarely (if ever) have a length > 1 but including in case there's a use case to fill each step
FloodFillReturnObject.FloodFilledAutomata = fFG
// FloodFillReturnObject.seedArg = CellularAutomataArguments.seedArg
// FloodFillReturnObject.verifySeed = CellularAutomataArguments.verifySeed
}
// _DEBUG && renderGrid(floodFillGrids[0])

console.log(JSON.stringify(FloodFillReturnObject))

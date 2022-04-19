import { parse } from "../../_utils/_deps.ts";
import { proto } from "./_utils.ts";
import { CELL_STATE, DIVISION_CONSTRAINTS } from './_settings.ts'

proto()

const _DEBUG = 0

const gridReturnObj = {
  AnimationDuration: 0,
  Dimension: { columns: 0, rows: 0 },
  DivisionConstraints: {...DIVISION_CONSTRAINTS},
  Grid:[[0]],
  Seed: 0,
}

class Grid {
  readonly amtColumn:number
  readonly amtRow:number
  #grid:Array<number[]> = []

  constructor(amtColumn:number, amtRow:number) {
    this.amtColumn = amtColumn
    this.amtRow = amtRow

    this.#grid = []
    this.constructGrid()
  }
  
  constructGrid = () => {
    const initFill = CELL_STATE.COMMON.NON_CONSIDERED
    const arr = Array.from(Array(this.amtRow), () => new Array(this.amtColumn).fill(initFill))
    // console.log('arr', this.amtColumn, this.amtRow)
    gridReturnObj.Grid = arr
    }
  }

  const init = (rowAmt:number,colAmt:number,seedArg:number = new Date().getTime()) => {
    new Grid(colAmt, rowAmt)
    gridReturnObj.Seed = seedArg
    gridReturnObj.Dimension = { columns: colAmt, rows: rowAmt }
    if (typeof Deno === 'undefined') return gridReturnObj// return if running in Browser
    console.log(JSON.stringify(gridReturnObj)) // CLI
    return gridReturnObj
  }
  

  if (typeof Deno !== 'undefined') { // CLI
    const parsedArgs = parse(Deno.args)
    const { r: row = 13, c: col = 17,
      s: seed = new Date().getTime(),
      anim = 0,
      rooms = null
    } = parsedArgs
  
    gridReturnObj.AnimationDuration = anim
      ? typeof anim === 'number' ? Math.min(Math.max(100,anim),1000) : 500
      : 0
    if (rooms) gridReturnObj.DivisionConstraints.ROOMS = rooms
  
    init(row,col,seed) 
  }
  export const setMazeProps = (c=0,r=0,s=0,t='') => {
    return init(r,c,s)
  } // Browser
  
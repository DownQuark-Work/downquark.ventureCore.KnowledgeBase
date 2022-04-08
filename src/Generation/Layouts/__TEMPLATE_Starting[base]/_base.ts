import { parse } from "../../_utils/_deps.ts";
import { CELL_STATE } from './_settings.ts'

const _DEBUG = 0

const gridReturnObj = {
  AnimationDuration: 0,
  Grid:{flatGrid:[[0]]},
  Seed: 0,
}

class Cell {
  _state:number
  readonly column:number
  readonly row:number
  
  get state() { return this._state }
  set state(s:number) { this._state = s }
  
  constructor(row:number, column:number, state:number = CELL_STATE.COMMON.NON_CONSIDERED){
    this._state = state
    this.column = column
    this.row = row
  }
}

class Grid {
  readonly amtColumn:number
  readonly amtRow:number
  _flatGrid:Array<number[]> = []
  #grid:Array<Cell[]>

  get flatGrid() { return this._flatGrid }

  constructor(amtColumn:number, amtRow:number) {
    this.amtColumn = amtColumn
    this.amtRow = amtRow

    this.#grid = []
    this._flatGrid = []
    this.constructGrid()
  }
  
  constructGrid = () => {
    const initFill = CELL_STATE.COMMON.NON_CONSIDERED
    const arr = Array.from(Array(this.amtRow), () => new Array(this.amtColumn).fill(initFill))
    console.log('INITIAL arr', arr)
    }
  }

  const init = (rowAmt:number,colAmt:number,seedArg:number = new Date().getTime()) => {
    gridReturnObj.Seed = seedArg
    gridReturnObj.Grid = new Grid(colAmt, rowAmt)
    if (typeof Deno === 'undefined') return gridReturnObj// return if running in Browser
    console.log(JSON.stringify(gridReturnObj)) // CLI
    _DEBUG && console.log('DEBUG :: Maze/_base.ts is in DEBUG mode - this may cause errors')
    return gridReturnObj
  }
  

  if (typeof Deno !== 'undefined') { // CLI
    const parsedArgs = parse(Deno.args)
    const { r: row = 13, c: col = 17,
      s: seed = new Date().getTime(),
      anim = 0,
    } = parsedArgs
  
    gridReturnObj.AnimationDuration = anim
      ? typeof anim === 'number' ? Math.min(Math.max(100,anim),500) : 225
      : 0
  
    init(row,col,seed) 
  }
  export const setMazeProps = (c=0,r=0,s=0,t='') => {
    return init(r,c,s)
  } // Browser
  
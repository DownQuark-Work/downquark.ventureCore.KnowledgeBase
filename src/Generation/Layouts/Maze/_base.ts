// deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313
// deno run Layouts/Maze/_base.ts -r 13 -c13 -t RENDER_MAZE_AS.WALLED -s 42
import { SETTINGS } from './_settings.ts'
import {renderGrid} from '../../_utils/cli-view.ts'
import { parse } from "../../_utils/_deps.ts";

const _DEBUG = 0

const mazeReturnObject = {
  Grid:{flatGrid:[[0]]},
  Type: SETTINGS.RENDER_MAZE_AS.PASSAGE,
  Seed: 0,
}

class Cell {
  _state:number|number[]
  readonly column:number
  readonly row:number
  
  get state() { return this._state as any }
  set state(s:number) { this._state = s }
  
  constructor(row:number, column:number, state:number|number[] = SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CREATED){
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
    this.amtColumn = (amtColumn%2===0) ? amtColumn+1 : amtColumn // columns and rows
    this.amtRow = (amtRow%2===0) ? amtRow+1 : amtRow             // must be odd

    this.#grid = []
    this._flatGrid = []
    this.constructGrid()
  }

  constructGrid = ()=>{
    for(let curRow = 0; curRow < this.amtRow; curRow++) {
      const c = [],
            f = []
      for(let curCol = 0; curCol < this.amtColumn; curCol++) {
        const cell = mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.WALLED
          ? new Cell(curRow,curCol,SETTINGS.ACTIVE_WALLS)
          : new Cell(curRow,curCol,curRow%2===0 ? 0 : curCol%2!==0
            ? SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CARVED
            : SETTINGS.CELL_STATE.COMMON.CREATED)
        c.push(cell)
        f.push(cell.state)
      }
      this.#grid.push(c)
      this._flatGrid.push(f)
    }
    _DEBUG && console.log('this.#grid', this.#grid)
  }
}

const init = (rowAmt:number,colAmt:number,mazeType:string,seedArg:number = new Date().getTime()) => {
  mazeReturnObject.Seed = seedArg
  if (mazeType === SETTINGS.RENDER_MAZE_AS.WALLED) mazeReturnObject.Type = SETTINGS.RENDER_MAZE_AS.WALLED
  mazeReturnObject.Grid = new Grid(colAmt, rowAmt)
    // return if running in Browser
  if (typeof Deno === 'undefined') { console.log('mazeReturnObject', mazeReturnObject); return mazeReturnObject }
    // will need a new CLI render method for walled maze
  _DEBUG &&  mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.PASSAGE && renderGrid(mazeReturnObject.Grid.flatGrid)
  // log as string if passing through Deno
  console.log(JSON.stringify(mazeReturnObject))
}

if (typeof Deno !== 'undefined') { // CLI
  const parsedArgs = parse(Deno.args)
  init(parsedArgs.c,parsedArgs.r,parsedArgs.t||'',parsedArgs.s) 
}
export const setMazeProps = (c=0,r=0,t='',s=0) => { init(r,c,t,s) } // Browser

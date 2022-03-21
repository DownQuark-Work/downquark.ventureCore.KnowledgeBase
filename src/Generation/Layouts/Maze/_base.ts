// deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313 --anim 225
// deno run Layouts/Maze/_base.ts -r 13 -c 13 -s 1313 --prim --anim 225
// deno run Layouts/Maze/_base.ts -r 13 -c13 -t -walled -s 42
import { SETTINGS } from './_settings.ts'
import {renderGrid} from '../../_utils/cli-view.ts'
import { parse } from "../../_utils/_deps.ts";

const _DEBUG = 0

const mazeReturnObject = {
  Algorithm: SETTINGS.RENDER_MAZE_AS.BACKTRACKER,
  AnimationDuration: 0,
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

  constructCell = (curRow:number,curCol:number) => {
    return mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.WALLED
          ? new Cell(curRow,curCol,SETTINGS.ACTIVE_WALLS)
          : new Cell(curRow,curCol,curRow%2===0 ? SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED : curCol%2!==0
            ? SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].UNCARVED
            : SETTINGS.CELL_STATE.COMMON.CREATED)
  }

  createGridLoop = () => {
    for(let curRow = 0; curRow < this.amtRow; curRow++) {
      const c = [], f = []
      for(let curCol = 0; curCol < this.amtColumn; curCol++) {
        const cell = this.constructCell(curRow,curCol)
        c.push(cell)
        f.push(cell.state)
      }
      this.#grid.push(c)
      this._flatGrid.push(f)
    }
  }

  createGridFlood = () => {
    const initFill = mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.WALLED ? [0,0,0,0] : SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED
    const arr = Array.from(Array(this.amtColumn), () => new Array(this.amtRow).fill(initFill));
    if (mazeReturnObject.Algorithm === SETTINGS.RENDER_MAZE_AS.SIDEWINDER) {
      initFill === SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED
      ? arr[0] = new Array(this.amtRow).fill(SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CARVED)
      : arr[0] = new Array(this.amtRow).fill([0,1,1,1])
      arr[0][0] = SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED
      arr[0][this.amtRow-1] = SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED
    }
    this._flatGrid = arr
  }

  constructGrid = () => {
    switch (mazeReturnObject.Algorithm)
    {
      case SETTINGS.RENDER_MAZE_AS.SIDEWINDER:
        this.createGridFlood()
        break;
      default :
        this.createGridLoop()
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
  _DEBUG &&  mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.PASSAGE
    &&  (mazeReturnObject.Algorithm === SETTINGS.RENDER_MAZE_AS.BACKTRACKER || mazeReturnObject.Algorithm === SETTINGS.RENDER_MAZE_AS.PRIM)
    && renderGrid(mazeReturnObject.Grid.flatGrid) // TODO(@mlnck): Handle this _only_ in separate Maze files (primtracker, sidewinder, etc)
  // log as string if passing through Deno
  console.log(JSON.stringify(mazeReturnObject))
  _DEBUG && console.log('DEBUG :: Maze/_base.ts is in DEBUG mode - this may cause errors')
}

if (typeof Deno !== 'undefined') { // CLI
  const parsedArgs = parse(Deno.args)
  const {
    r: row = 13,
    c: col = 17,
    s: seed = new Date().getTime(),
    anim = 0,
    prim = false, // defaults to BACKTRACKER
    sdwndr = false,
    walled = false, // defaults to PASSAGE
  } = parsedArgs

  mazeReturnObject.AnimationDuration = anim
    ? typeof anim === 'number' ? Math.min(Math.max(100,anim),500) : 225
    : 0
  
    mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.BACKTRACKER
    if (prim) { mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.PRIM }
    if (sdwndr) { mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.SIDEWINDER }

  init(row,col,walled && SETTINGS.RENDER_MAZE_AS.WALLED,seed) 
}
export const setMazeProps = (c=0,r=0,t='',a='',s=0) => { init(r,c,t,s) } // Browser

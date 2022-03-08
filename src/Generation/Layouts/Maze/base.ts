// deno run Layouts/Maze/base.ts 13 13
// deno run Layouts/Maze/base.ts 13 13 RENDER_MAZE_AS.WALLED
import {renderGrid} from '../../_utils/cli-view.ts'
import { SETTINGS } from './_settings.ts'
const maze = {
  Grid:{flatGrid:[[0]]},
  Type: SETTINGS.RENDER_MAZE_AS.PASSAGE
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
    for(let curRow = 0; curRow < this.amtRow; curRow++) { // starting at index 1 because first row was added above
      const c = [],
            f = []
      for(let curCol = 0; curCol < this.amtColumn; curCol++) {
        const cell = maze.Type === SETTINGS.RENDER_MAZE_AS.WALLED
          ? new Cell(curRow,curCol,SETTINGS.ACTIVE_WALLS)
          : new Cell(curRow,curCol,curRow%2===0 ? 0 : curCol%2!==0
            ? SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CARVED
            : SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE)
        c.push(cell)
        f.push(cell.state)
      }
      this.#grid.push(c)
      this._flatGrid.push(f)
    }
    // console.log('this.#grid', this.#grid)
  }
}

const init = (rowAmt:number,colAmt:number,mazeType:string) => {
  if (mazeType === SETTINGS.RENDER_MAZE_AS.WALLED) maze.Type = SETTINGS.RENDER_MAZE_AS.WALLED
  // const MazeGrid = new Grid(colAmt, rowAmt)
  maze.Grid = new Grid(colAmt, rowAmt)
  if (typeof Deno !== 'undefined') {
    // console.log('maze.Grid', maze.Grid)
    maze.Type === SETTINGS.RENDER_MAZE_AS.PASSAGE && renderGrid(maze.Grid.flatGrid) // will need a new CLI render method for walled maze
  }
}

(typeof Deno !== 'undefined') && init(parseInt(Deno.args[0],10),parseInt(Deno.args[1],10),Deno.args[2]) // CLI
export const setMazeProps = (c=0,r=0,t='') => { init(r,c,t) } // Browser

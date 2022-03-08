// deno run Layouts/Maze/base.ts 13 13
import {renderGrid} from '../../_utils/cli-view.ts'
import { SETTINGS } from './_settings.ts'
const maze = {
  Grid:[[0]]
}

class Cell {
  _state:number
  readonly column:number
  readonly row:number
  
  get state() { return this._state }
  set state(s:number) { this._state = s }
  
  constructor(row:number, column:number, state = SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CREATED){
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

  constructor(amtColumn:number, amtRow:number, mazeType:string) {
    console.log('mazeType', mazeType)
    this.amtColumn = (amtColumn%2===0) ? amtColumn+1 : amtColumn // columns and rows
    this.amtRow = (amtRow%2===0) ? amtRow+1 : amtRow             // must be odd

    this.#grid = [new Array(this.amtColumn).fill(null).map((_i,indx) => new Cell(0,indx,SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE))]
    this._flatGrid = [new Array(this.amtColumn).fill(SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE)]
    this.constructGrid()
  }

  constructGrid = ()=>{
    for(let curRow = 1; curRow < this.amtRow; curRow++) { // starting at index 1 because first row was added above
      const c = [new Cell(curRow,0,SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE)] // 0 index will always be CONCRETE
      const f = [SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE]
      for(let curCol = 1; curCol < this.amtColumn; curCol++) {
        const cell = new Cell(curRow,curCol,curRow%2===0 ? 0 : curCol%2!==0
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

const init = (rowAmt:number,colAmt:number,mazeType = SETTINGS.RENDER_MAZE_AS.PASSAGE) => {
  const MazeGrid = new Grid(colAmt, rowAmt, mazeType)
  maze.Grid = MazeGrid.flatGrid
  if (typeof Deno !== 'undefined') {
    // console.log('maze.Grid', maze.Grid)
    renderGrid(maze.Grid)
  }
}

(typeof Deno !== 'undefined') && init(parseInt(Deno.args[0],10),parseInt(Deno.args[1],10)) // CLI
export const setMazeProps = (c=0,r=0) => { init(r,c) } // Browser

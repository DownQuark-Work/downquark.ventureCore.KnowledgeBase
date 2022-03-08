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
  #grid:Array<Array<Cell>>
  constructor(amtColumn:number, amtRow:number) {
    this.amtColumn = (amtColumn%2===0) ? amtColumn : amtColumn++ // columns and rows
    this.amtRow = (amtRow%2===0) ? amtRow : amtRow++             // must be odd
    // this.#grid = this.constructGrid(amtColumn,amtRow)
    this.#grid = [new Array(amtColumn+2).fill(null).map((_i,indx) => new Cell(0,indx,SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE))] // +2 for edges
    this.constructGrid()
    // this.#grid.push([new Array(amtColumn+2).fill(null).map(i => new Cell(this.#grid.length-1,i,'CONCRETE'))]) // +2 for edges
  }

  constructGrid = ()=>{
    for(let curRow = 0; curRow < this.amtRow; curRow++) {
      const c = [new Cell(curRow,0,SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE)]
      for(let curCol = 0; curCol < this.amtColumn; curCol++) {
        c.push(new Cell(curRow,curCol,curCol%2===0 ? SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CARVED : SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE))
        // c.push(curRow%2!==0 ? 0 : curCol%2===0 ? 1 : 0 )
      }
      c.push(new Cell(curRow,this.#grid[0].length,SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CONCRETE))
      console.log('c', c)
      // this.#grid[0].push(c) // MAKE SURE TO ADD THIS LINE: NEEDED
    }
  }
}

const init = (rowAmt:number,colAmt:number) => {
  console.info('REPLACE BELOW WITH ABOVE')
  if (colAmt%2===0) colAmt++ // columns and rows
  if (rowAmt%2===0) rowAmt++ // must be odd
  const Grid = [new Array(colAmt+2).fill(0)] // +2 for edges
  for(let curRow = 0; curRow < rowAmt; curRow++) {
    const c = [0]
    for(let curCol = 0; curCol < colAmt; curCol++) {
      c.push(curRow%2!==0 ? 0 : curCol%2===0 ? 1 : 0 )
    }
    c.push(0)
    Grid.push(c)
  }
  Grid.push(new Array(colAmt+2).fill(0))
  maze.Grid = Grid
  console.info('REPLACE ABOVE WITH HIGH ABOVE')
  console.log('maze.Grid', maze.Grid)
  renderGrid(maze.Grid)
}

(typeof Deno !== 'undefined') && init(parseInt(Deno.args[0],10),parseInt(Deno.args[1],10)) // CLI
export const setMazeProps = (c=0,r=0) => { init(r,c) } // Browser

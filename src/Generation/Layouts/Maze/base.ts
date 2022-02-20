// deno run Layouts/Maze/base.ts 13 13
import {renderGrid} from '../../_utils/cli-view.ts'
const maze = {
  Grid:[[0]]
}

type CellStateType = 'CARVED' | 'CONSIDER' | 'CONCRETE' | 'CREATED'
class Cell {
  state:CellStateType
  readonly column:number
  readonly row:number
  constructor(row:number, column:number, state:CellStateType = 'CREATED'){
    this.state = state
    this.column = column
    this.row = row
  }
}

class Grid {
  readonly amtColumn:number
  readonly amtRow:number
  private _grid:Array<Array<Cell>>
  constructor(amtColumn:number, amtRow:number) {
    this.amtColumn = (amtColumn%2===0) ? amtColumn : amtColumn++ // columns and rows
    this.amtRow = (amtRow%2===0) ? amtRow : amtRow++             // must be odd
    // this._grid = this.constructGrid(amtColumn,amtRow)
    this._grid = [new Array(amtColumn+2).fill(null).map((_i,indx) => new Cell(0,indx,'CONCRETE'))] // +2 for edges
    this.constructGrid()
    // this._grid.push([new Array(amtColumn+2).fill(null).map(i => new Cell(this._grid.length-1,i,'CONCRETE'))]) // +2 for edges
  }

  constructGrid = ()=>{
    for(let curRow = 0; curRow < this.amtRow; curRow++) {
      const c = [new Cell(curRow,0,'CONCRETE')]
      for(let curCol = 0; curCol < this.amtColumn; curCol++) {
        c.push(new Cell(curRow,curCol,curCol%2===0 ? 'CARVED' : 'CONCRETE'))
        // c.push(curRow%2!==0 ? 0 : curCol%2===0 ? 1 : 0 )
      }
      c.push(new Cell(curRow,this._grid[0].length,'CONCRETE'))
      console.log('c', c)
      // this._grid[0].push(c) // MAKE SURE TO ADD THIS LINE: NEEDED
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
export const setMazeProps = (c:number=0,r:number=0) => { init(r,c) } // Browser

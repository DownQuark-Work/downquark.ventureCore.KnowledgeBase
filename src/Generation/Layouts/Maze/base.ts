// deno run Layouts/Maze/base.ts 13 13
import {renderGrid} from '../../_utils/cli-view.ts'
const maze = {
  Grid:[[0]]
}
const init = (rowAmt:number,colAmt:number) => {
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
  console.log('maze.Grid', maze.Grid)
  renderGrid(maze.Grid)
}

(typeof Deno !== 'undefined') && init(parseInt(Deno.args[0],10),parseInt(Deno.args[1],10)) // CLI
export const setMazeProps = (c:number=0,r:number=0) => { init(r,c) } // Browser

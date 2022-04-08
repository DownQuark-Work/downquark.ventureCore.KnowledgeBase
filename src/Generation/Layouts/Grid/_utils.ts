// deno-lint-ignore-file no-explicit-any
import {CELL_STATE} from './_settings.ts'

const _DEBUG = 0
export const denoLog = (...logVal:any[]) => {
  if (typeof Deno !== 'undefined') console.log(...logVal)
}
export const renderGridPassage = (Grid:Array<number[]|string[]>) => {
  !_DEBUG && console.clear()
  const topBorder:'_'[] = [...Array(Grid[0].length+2).fill('_')],
    bottomBorder:'-'[] = [...Array(Grid[0].length+2).fill('—')]
    console.log(...topBorder)
  Grid.forEach((row: number[]|string[]) => {
    const graphics = row.map(i => {
        switch(i)
        {
          case CELL_STATE.CORRIDOR.CARVED:
          case CELL_STATE.CORRIDOR.UNCARVED:
            return '🀫'
          case CELL_STATE.CORRIDOR.IN_PATH:
            return '◘'
          case CELL_STATE.COMMON.CONSIDER:
            return '#'
          case CELL_STATE.COMMON.CURRENT:
            return '○'
          case CELL_STATE.EGGRESS.ENTER:
            return 'E'
          case CELL_STATE.EGGRESS.EXIT:
            return 'X'
          default:
            return ' '
        }
    })
    const gRow = ['|', ...graphics, '|']
    console.log(...gRow) 
  })
  console.log(...bottomBorder)
}
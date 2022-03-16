import {CELL_STATE, RENDER_MAZE_AS} from './_settings.ts'

const _DEBUG = 1
export const renderGridPassage = (Grid:Array<number[]|string[]>) => {
  !_DEBUG && console.clear()
  const topBorder:'_'[] = [...Array(Grid[0].length+2).fill('_')],
    bottomBorder:'-'[] = [...Array(Grid[0].length+2).fill('—')]
    console.log(...topBorder)
  Grid.forEach((row: number[]|string[]) => {
    // let char = switch(CELL_STATE)
    // console.log('CELL_STATE', CELL_STATE)
    // console.log('RENDER_MAZE_AS', RENDER_MAZE_AS)
    const graphics = row.map(i => {
        switch(i)
        {
          case CELL_STATE[RENDER_MAZE_AS.PASSAGE].CARVED:
          case CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED:
            return '🀫'
          case CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH:
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
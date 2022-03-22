import {CELL_DIRECTIONS_MAP, CELL_STATE, RENDER_MAZE_AS} from './_settings.ts'

const _DEBUG = 0
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

export const createEgress:(_:string,__:{Grid:{amtColumn:number,amtRow:number}, Maze?:Array<number[]>, seedPointer:any, }) => {Enter:number[],Exit:number[]} = (RenderType, {Grid, Maze=[[0]], seedPointer}) => {
  const colAmt = Grid.amtColumn,
        rowAmt = Grid.amtRow,
        restraintColAmt = colAmt - Math.floor(colAmt/2.1),
        restraintRowAmt = rowAmt - Math.floor(rowAmt/2.1),
        denomCol = 10 / colAmt,
        denomRow = 10 / rowAmt,
        denomRestraintCol = 10 / restraintColAmt,
        denomRestraintRow = 10 / restraintRowAmt,
        mazeBounds:{[k:string]:number} = {
          BOTTOM: rowAmt-1,
          LEFT: 0,
          RIGHT: colAmt-1,
          TOP: 0,
        }
  
  while( seedPointer() > 7) // 8 & 9 would cause bias towards BOTTOM LEFT
  { seedPointer.inc() }
  
  const entWall = CELL_DIRECTIONS_MAP[seedPointer()%4]
  seedPointer.inc()
  const exWall = CELL_DIRECTIONS_MAP[seedPointer()%4] === entWall ? CELL_DIRECTIONS_MAP[(seedPointer()+1)%4] : CELL_DIRECTIONS_MAP[seedPointer()%4] // ensures not the entrance wall
  seedPointer.inc()

  if(RenderType === RENDER_MAZE_AS.BACKTRACKER || RenderType === RENDER_MAZE_AS.PRIM) { // START primtracker
    let entLoc = (entWall.charAt(entWall.length-1) === 'T') ? Math.floor(seedPointer()/denomRow) : Math.floor(seedPointer()/denomCol) // charAt matches LEFT || RIGHT
    if (entLoc%2===0){ entLoc = Math.max(entLoc--,1) } // location must be odd and positive
    seedPointer.inc()

    const exitConstraints = (
      exWall.charAt(exWall.length-1) !== entWall.charAt(entWall.length-1) // lefT righT
      && exWall.charAt(1) !== entWall.charAt(1) // tOp bOttom
    )
    ? exWall.charAt(exWall.length-1) === 'T' ? -denomRestraintRow : -denomRestraintCol
    : exWall.charAt(exWall.length-1) === 'T' ? denomRow : denomCol

  let exLoc = (exitConstraints < 0)
    ? Math.floor(seedPointer()/Math.abs(exitConstraints) + Math.floor(Math.min(restraintColAmt,restraintRowAmt)/2))
    : Math.floor(seedPointer()/exitConstraints)
    if (exLoc%2===0){ Math.max(exLoc--,1) } // location must be odd and positive
    
    const entPt = (entWall.charAt(entWall.length-1) === 'T') ? [entLoc,mazeBounds[entWall]] : [mazeBounds[entWall],entLoc]
    const exPt = (exWall.charAt(exWall.length-1) === 'T') ? [exLoc,mazeBounds[exWall]] : [mazeBounds[exWall],exLoc]
    return {Enter:entPt, Exit:exPt}
  }
  // END primtracker
  
  if(RenderType === RENDER_MAZE_AS.SIDEWINDER) { // START sidewinder
    const getLocation = (wall:string) => {
      seedPointer.inc()
      
      const initialLoc = (wall.charAt(wall.length-1) === 'T')
            ? Math.min(Math.max(Math.round(seedPointer()/denomCol) + 1,1), colAmt-1)
            : Math.min(Math.max(Math.round(seedPointer()/denomRow) + 1,1), rowAmt-1)
      let colCheck = colAmt - 2,
          rowCheck = 1
      switch(wall) {
        case 'LEFT': 
          colCheck = 1
          /* falls through */
        case 'RIGHT':
          rowCheck = initialLoc
          while(rowCheck && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) rowCheck--
          if(!rowCheck) {
            while(rowCheck < rowAmt - 1 && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) rowCheck++
          }
          return [rowCheck, colCheck === 1 ? 0 : colAmt - 1]
        case 'BOTTOM':
          rowCheck = rowAmt - 2
          /* falls through */
        case 'TOP':
        default:
          colCheck = initialLoc
          while(colCheck && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) colCheck--
          if(!colCheck) {
            while(colCheck < rowAmt - 1 && Maze[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) colCheck++
          }
          return [rowCheck === 1 ? 0 : rowAmt - 1, colCheck]
      }
    }
    return {Enter:getLocation(entWall), Exit:getLocation(exWall)}
  }
   // END sidewinder
  
   // console.log('UTIL: entWall, exWall', entWall, exWall)
  // console.log('UTIL:', entPt, exPt)
  
  return {Enter:[0,0], Exit:[0,0]}
}
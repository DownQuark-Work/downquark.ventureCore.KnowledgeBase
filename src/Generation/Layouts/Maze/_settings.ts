const GRID_HEIGHT = 13
const GRID_WIDTH = 13

export const RENDER_MAZE_AS = {
  PASSAGE: 'RENDER_MAZE_AS.PASSAGE',
  WALLED: 'RENDER_MAZE_AS.WALLED'
}

const CELL_STATE:{[k:string]: {[k:string]: number}} = {
  COMMON: {
    CREATED: -2,
    CONSIDER: -1,
  }
}
CELL_STATE[RENDER_MAZE_AS.PASSAGE] = {
  CONCRETE: 0,
  CARVED: 1,
}
/*
  CELL_STATE[RENDER_MAZE_AS.WALLED] values
  correspond to the ACTIVE_WALLS array
  [0,0,0,0] =>  NO borders shown on tile
  [1,1,1,1] => ALL sides display border
  [0,1,1,0] => LEFT && RIGHT sides display border
  ... etc
*/
CELL_STATE[RENDER_MAZE_AS.WALLED] = {
  BOTTOM: 0,
  LEFT: 1,
  RIGHT: 2, 
  TOP: 3,
}
const ACTIVE_WALLS = [CELL_STATE.COMMON.CREATED,CELL_STATE.COMMON.CREATED,CELL_STATE.COMMON.CREATED,CELL_STATE.COMMON.CREATED]

export const SETTINGS = {
  CELL_STATE,
  GRID_HEIGHT,
  GRID_WIDTH,
  RENDER_MAZE_AS,
  ACTIVE_WALLS
}

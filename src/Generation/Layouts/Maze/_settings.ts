export const SHOW_ANIMATION = 0 // override, must be set by developer so no limit on what it can be

const GRID_HEIGHT = 13
const GRID_WIDTH = 13

const CELL_DIRECTIONS = {
  BOTTOM: 0,
  LEFT: 1,
  RIGHT: 2, 
  TOP: 3,
}
export const CELL_DIRECTIONS_MAP = ['BOTTOM','LEFT','RIGHT', 'TOP',]

export const RENDER_MAZE_AS = {
  PASSAGE: 'RENDER_MAZE_AS.PASSAGE',
  WALLED: 'RENDER_MAZE_AS.WALLED',
  BACKTRACKER: 'RENDER_MAZE.WITH_BACKTRACKER',
  PRIM: 'RENDER_MAZE.WITH_PRIM',
  SIDEWINDER: 'RENDER_MAZE.WITH_SIDEWINDER',
}

export const CELL_STATE:{[k:string]: {[k:string]: number}} = {
  COMMON: {
    NON_CONSIDERED: 0,
    CONSIDER: -1.1,
    CREATED: -1.2,
    CURRENT: -1.3,
  },
  EGGRESS: {
    ENTER: -2.1,
    EXIT: -2.2,
  },
}
CELL_STATE[RENDER_MAZE_AS.PASSAGE] = {
  CONCRETE: 0,
  UNCARVED: 1.0,
  CARVED: 1.1,
  IN_PATH: 2.1,
}
/*
  CELL_STATE[RENDER_MAZE_AS.WALLED] values
  correspond to the ACTIVE_WALLS array
  [0,0,0,0] =>  NO borders shown on tile
  [1,1,1,1] => ALL sides display border
  [0,1,1,0] => LEFT && RIGHT sides display border
  ... etc
*/
CELL_STATE[RENDER_MAZE_AS.WALLED] = CELL_DIRECTIONS
const ACTIVE_WALLS = [CELL_STATE.COMMON.CREATED,0,0,0]

export const SETTINGS = {
  ACTIVE_WALLS,
  CELL_STATE,
  GRID_HEIGHT,
  GRID_WIDTH,
  RENDER_MAZE_AS,
}

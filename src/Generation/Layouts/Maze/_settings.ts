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
CELL_STATE[RENDER_MAZE_AS.WALLED] = { // prime numbers allow for eashy combinations
  OPEN: 0, // unchecked
  BOTTOM: 1,
  LEFT: 3,
  RIGHT: 5, 
  TOP: 7,
}

const WALLED_STATE_IMAGE_MAP = {
  0: '🀫', // blocks the path
  // BASIC
  1: '_',
  3: '⎜',
  5: '⎟',
  7: '¯', // ￣
  // CORNERS
  4: '⎣',
  6: '⎦',
  10: '⎡',
  12: '⎤',
  z:'⨅⨆⊐⊏][]'
}

export const SETTINGS = {
  CELL_STATE,
  GRID_HEIGHT,
  GRID_WIDTH,
  RENDER_MAZE_AS,
  WALLED_STATE_IMAGE_MAP
}

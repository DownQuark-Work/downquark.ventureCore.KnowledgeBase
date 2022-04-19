export const [START_COL, START_ROW, END_COL, END_ROW] = new Array(4).fill(0).map((_,i) => i)
/**
 * PERCENT: 0-1: percentage of area :: .05 -> divide until rooms are ~5% of total Grid
 * AREA: <rows*columns> area :: 34 -> divide until roomColAmt * roomRowAmt is ~ 34
 * ROOMS: amount of divisions to create :: -13 -> divide until there are 13 rooms
 * - Add multiple constraints and the first one to be achieved will stop the divisions
 */
export const DIVISION_CONSTRAINTS = {
  WALL_LENGTH: 5, // min room wall length will be (WALL_LENGTH - 2) for each side
  ROOMS: 35
}
export const WOBBLE_RANGE = [.08, .27] // used when determining how far off-center a divide will be
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
  CORRIDOR: {
    UNCARVED: 1.0,
    CARVED: 1.1,
    IN_PATH: 2.1,
  }
}
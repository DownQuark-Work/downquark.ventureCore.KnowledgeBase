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
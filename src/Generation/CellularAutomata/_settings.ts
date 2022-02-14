// 1: Any live cell with two or three live neighbours survives.
// const SURVIVING_CELL_RANGE = [2,3] // Avatar
// const SURVIVING_CELL_RANGE = [2,3] // GOL
const SURVIVING_CELL_RANGE = [3,4,5,6,7,8] // Rogue
// 2: Any dead cell with three live neighbours becomes a live cell.
// const TO_LIFE_RANGE = [0,1] // Avatar
// const TO_LIFE_RANGE = [3] // GOL
const TO_LIFE_RANGE = [6,7,8] // Rogue
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

const GRID_HEIGHT = 10
const GRID_WIDTH = 10

const ITERATIONS = 0

const RENDER_AS = {
  BINARY: (state:number) => state > 0 ? '1' : '0',
  AGGREGATE: (state:number) => '' + state,
  CHAR: (state:number,on:string,off:string) => state > 0 ? on : off
}
// command to run to check this: deno run run.ts 10 10 100 129 (notice different iteration count when on vs off - position [2,9] is cause)
const RENDER_AGGREGATE_DELTA = true // FALSE returns high/low when aggregating
const RETURN_ALL_STEPS = false // not recommended for large grids

export const SETTINGS = {
  GRID_HEIGHT,
  GRID_WIDTH,
  ITERATIONS,
  RENDER_AGGREGATE_DELTA,
  RENDER_AS,
  RETURN_ALL_STEPS,
  SURVIVING_CELL_RANGE,
  TO_LIFE_RANGE,
}

// http://pcg.wikidot.com/category-pcg-algorithms
// https://www.hermetic-systems.com/compsci/cellular_automata_algorithms.htm
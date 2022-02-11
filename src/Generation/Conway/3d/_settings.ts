// 1: Any live cell with two or three live neighbours survives.
const SURVIVING_CELL_COMPARISON_TYPE = 'ALIVE'
const SURVIVING_CELL_RANGE = [2,3]
// 2: Any dead cell with three live neighbours becomes a live cell.
const TO_LIFE_COMPARISON_TYPE = 'ALIVE'
const TO_LIFE_RANGE = [3]
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.

const GRID_HEIGHT = 10
const GRID_WIDTH = 10

const ITERATIONS = 5

export const SETTINGS = {
  GRID_HEIGHT,
  GRID_WIDTH,
  ITERATIONS,
  SURVIVING_CELL_COMPARISON_TYPE,
  SURVIVING_CELL_RANGE,
  TO_LIFE_COMPARISON_TYPE,
  TO_LIFE_RANGE,
}
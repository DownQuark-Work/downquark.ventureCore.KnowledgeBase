// deno run FloodFill/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 100 11)

// https://learnersbucket.com/examples/algorithms/flood-fill-algorithm-in-javascript/
// Prepend every "room" with an id ->  [[12,12,12,-2,3,3],[10,12,12,-2,3,-4]] -> [[1:12,1:12,1:12,-2,2:3,2:3],[3:10,1:12,1:12,-2,2:3,-4]]
// - no need to append a room to <= 0

const CellularAutomataArguments = JSON.parse(Deno.args[0])
console.log('CellularAutomataArguments', CellularAutomataArguments)

// let curRoom = 0

// for(let row = 0; row < CellularAutomataGrid.length; row++) {
//   for(let column = 0; column < CellularAutomataGrid[row].length; column++) {
//     console.log('row,column,CellularAutomataGrid[row][column]', row,column,CellularAutomataGrid[row][column])
//   }
// }
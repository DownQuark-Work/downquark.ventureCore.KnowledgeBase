// deno run ./_utils/corridor.ts $(deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 11))  <-- seed with a replaced shuffled value
// deno run ./_utils/corridor.ts $(deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 12))  <-- seed needing 7 connections
// deno run ./_utils/corridor.ts $(deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 35 20 13)) <-- looks nice
// deno run ./_utils/corridor.ts $(deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 35 20 1645140149291)) <-- looks nice
// deno run ./_utils/corridor.ts $(deno run ./_utils/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 60 40 13))  <-- larger one, looks nice
import {renderGrid} from '../_utils/cli-view.ts'

const _DEBUG = false
const CorridorReturnObject: {
  seedArg?: number;
  verifySeed?: number;
  CorridorAutomata: Array<Array<string[]>>;
} = { CorridorAutomata: [] };
const FloodFillArguments = JSON.parse(Deno.args[0]);

const corridorMapIndexes: Array<number[]> = [];
CorridorReturnObject.seedArg = FloodFillArguments.seedArg;
CorridorReturnObject.verifySeed = FloodFillArguments.verifySeed;
CorridorReturnObject.CorridorAutomata = [
  ...FloodFillArguments.FloodFilledAutomata,
];

  // determine access points
// const determineAccessPoints = () => { // REFACTORED FNC START
FloodFillArguments.RoomAmount.forEach((rm: number) => {
  let shuffleIndexes = FloodFillArguments.verifySeed.toString(2) + '';
  while (
    shuffleIndexes.split('').length <
    CorridorReturnObject.CorridorAutomata[0].length
  ) {
    shuffleIndexes += '' + shuffleIndexes;
  }
  shuffleIndexes = shuffleIndexes.slice(
    0,
    CorridorReturnObject.CorridorAutomata[0].length
  );
  const shuffleIndexedArr = shuffleIndexes.split('');

  const shuffleArray = (arr: number[]) => {
    for (let i: number = arr.length - 1; i > 0; i--) {
      const j = parseInt(shuffleIndexedArr?.shift() || '0', 10) as number;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const toShuffle = [...Array(rm).keys()];
  let hasShuffled = shuffleArray([...toShuffle]);
  hasShuffled = shuffleArray([...hasShuffled]);

  toShuffle.forEach((rm, indx) => {
    if (rm === hasShuffled[indx]) indx = indx === 0 ? 1 : 0;
    corridorMapIndexes.push([rm, hasShuffled[indx]]);
  });
});
// } determineAccessPoints REFACTORED FNC END

const createBridge = (brdg: Array<number[]>) => {
  const [s, e] = brdg;
  // const [s,e,brdgId] = brdg
  const deltaRow = e[0] - s[0],
    deltaCol = e[1] - s[1];

  function bridgeRows() {
    for (let i = 0; i < Math.abs(deltaRow); i++) {
      const keyCell = s[0] + i * Math.max(Math.min(deltaRow, 1), -1);
      if (!/⊡/g.test(CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]])) {
        CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]] = '#'; // brdgId+'#'
      }
    }
  }
  function bridgeColumns() {
    for (let i = 0; i < Math.abs(deltaCol); i++) {
      const keyCell = s[1] + i * Math.max(Math.min(deltaCol, 1), -1);
      if (!/⊡/g.test(CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell])) {
        CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell] = '#'; // brdgId+'#'
      }
    }
  }
  bridgeRows();
  bridgeColumns();
};
//apply access points
// export const CreateCorridors = () => {

// - trigger below function to create `corridorMapIndexes`
// determineAccessPoints

// then should be able to just let it run
for (let i = 0; i < corridorMapIndexes.length; i++) {
  const bridgeSpan = [
    FloodFillArguments.RoomEgress[corridorMapIndexes[i][0]],
    FloodFillArguments.RoomEgress[corridorMapIndexes[i][1]],
    i, // for debug
  ];
  createBridge(bridgeSpan);
}

// and return `CorridorReturnObject` when finished
// END EXPORT
_DEBUG && renderGrid(CorridorReturnObject.CorridorAutomata[0], true)

console.log(JSON.stringify(CorridorReturnObject))

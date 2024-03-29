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
const FloodFillArguments: {[k:string]:any} = {
  seedArg: 0,
  verifySeed: 0,
  RoomAmount: [0],
  RoomEgress: {} as {[k:string]:number[]},
  FloodFilledAutomata:[[['NOT_YET_SET']]]
}
  
let corridorMapIndexes: Array<number[]> = [];
// determine access points
const determineAccessPoints = () => {
  CorridorReturnObject.seedArg = FloodFillArguments.seedArg;
  CorridorReturnObject.verifySeed = FloodFillArguments.verifySeed;
  CorridorReturnObject.CorridorAutomata = [
    ...FloodFillArguments.FloodFilledAutomata,
  ];

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
  let toShuffle = [], // reset arrays for multiple generations to remain consistent
    hasShuffled:number[] = []
  corridorMapIndexes = []

  toShuffle = [...Array(Math.ceil(rm/2)).keys()];
  hasShuffled = shuffleArray([...Array(Math.floor(rm/2)).keys()].map(i => i+toShuffle.length));
  hasShuffled = shuffleArray([...hasShuffled]);

  toShuffle.forEach((rm, indx) => {
    if (rm === hasShuffled[indx]) indx = indx === 0 ? 1 : 0;
    const crdr = hasShuffled[indx] || hasShuffled[0]
    corridorMapIndexes.push([rm, crdr]);
  });
});
}

const createBridge = (brdg: Array<number[]>) => {
  const [s, e] = brdg;
  // const [s,e,brdgId] = brdg
  const deltaRow = e[0] - s[0],
    deltaCol = e[1] - s[1];

  function bridgeRows() {
    for (let i = 0; i <= Math.abs(deltaRow); i++) {
      const keyCell = s[0] + i * Math.max(Math.min(deltaRow, 1), -1);
      if (
        keyCell < CorridorReturnObject.CorridorAutomata[0].length
        && !/⊡/g.test(CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]]) // only draw on open spaces
        && CorridorReturnObject.CorridorAutomata[0][keyCell] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]-1] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]-1] !== '#' // limit width of corridor
        && CorridorReturnObject.CorridorAutomata[0][keyCell] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]+1] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]+1] !== '#'
      ) {
        CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]] = '#'; // brdgId+'#'
      }
    }
  }
  function bridgeColumns() {
    for (let i = 0; i <= Math.abs(deltaCol); i++) {
      const keyCell = s[1] + i * Math.max(Math.min(deltaCol, 1), -1);
      if (
        keyCell < CorridorReturnObject.CorridorAutomata[0][0].length
        && !/⊡/g.test(CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell])
        && CorridorReturnObject.CorridorAutomata[0][e[0]-1] && CorridorReturnObject.CorridorAutomata[0][e[0]-1][keyCell] && CorridorReturnObject.CorridorAutomata[0][e[0]-1][keyCell] !== '#'
        && CorridorReturnObject.CorridorAutomata[0][e[0]+1] && CorridorReturnObject.CorridorAutomata[0][e[0]+1][keyCell] && CorridorReturnObject.CorridorAutomata[0][e[0]+1][keyCell] !== '#'
      ) {
        CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell] = '#'; // brdgId+'#'
      }
    }
  }
  bridgeRows();
  bridgeColumns();
};

//apply access points
const initCreation = () => {
// - trigger below function to create `corridorMapIndexes`
determineAccessPoints()

// then should be able to just let it run
for (let i = 0; i < corridorMapIndexes.length; i++) {
  const bridgeSpan = [
    FloodFillArguments.RoomEgress[corridorMapIndexes[i][0]],
    FloodFillArguments.RoomEgress[corridorMapIndexes[i][1]],
    i, // for debug
  ];
  createBridge(bridgeSpan);
}

_DEBUG && renderGrid(CorridorReturnObject.CorridorAutomata[0])
// stringify for cli
typeof Deno !== 'undefined' && console.log(JSON.stringify(CorridorReturnObject))
}// END EXPORT

// Browser
export const createCorridors = (browserArgs:any) => {
  Object.entries(browserArgs).forEach(entry => FloodFillArguments[entry[0]] = entry[1])
  FloodFillArguments && initCreation()
  return CorridorReturnObject
}
// CLI
if(typeof Deno !== 'undefined' && Deno?.args.length){ // allow to be run from command line
  const denoArgs = JSON.parse(Deno.args[0]);
  Object.entries(denoArgs).forEach(entry => FloodFillArguments[entry[0]] = entry[1])
  FloodFillArguments && initCreation()
}

// deno run Corridor/corridor.ts $(deno run FloodFill/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 100 11))  <-- seed with a replaced shuffled value
// deno run Corridor/corridor.ts $(deno run FloodFill/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 100 12))  <-- seed needing 7 connections
const CorridorReturnObject: {
  seedArg?:number,
  verifySeed?:number,
  //   RoomAmount?:number,
  CorridorAutomata:Array<Array<string[]>>
} = {CorridorAutomata : []}
const FloodFillArguments = JSON.parse(Deno.args[0])
console.log('FloodFillArguments', FloodFillArguments.RoomEgress)

const corridorMapIndexes:Array<number[]> = []
CorridorReturnObject.seedArg = FloodFillArguments.seedArg
CorridorReturnObject.verifySeed = FloodFillArguments.verifySeed
CorridorReturnObject.CorridorAutomata = [...FloodFillArguments.FloodFilledAutomata]
// determine access points
FloodFillArguments.RoomAmount.forEach((rm: any) => {
  let shuffleIndexes =  (FloodFillArguments.verifySeed).toString(2) + ''
  while (shuffleIndexes.split('').length < CorridorReturnObject.CorridorAutomata[0].length) {
    shuffleIndexes += '' + shuffleIndexes
  }
  shuffleIndexes = shuffleIndexes.slice(0,CorridorReturnObject.CorridorAutomata[0].length)
  const shuffleIndexedArr = shuffleIndexes.split('')
  
  const shuffleArray = (arr:number[]) => {
    for (let i:number = arr.length - 1; i > 0; i--) {
      const j =  parseInt(shuffleIndexedArr?.shift() || '0',10) as number
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
  }
  const toShuffle = [...Array(rm).keys()]
  let hasShuffled = shuffleArray([...toShuffle])
      hasShuffled = shuffleArray([...hasShuffled])
  
  toShuffle.forEach((rm,indx) => {
    if(rm === hasShuffled[indx]) indx = indx === 0 ? 1 : 0
    corridorMapIndexes.push([rm, hasShuffled[indx]])
  })
    // console.log('BEFORE')
    // CorridorReturnObject.CorridorAutomata[0].forEach((row: string[]) => console.log(...row))
  })

const createBridge = (brdg:Array<number[]>) => {
  const [s,e] = brdg
  // const [s,e,brdgId] = brdg
  const deltaRow = e[0] - s[0],
    deltaCol = e[1] - s[1]
  
  function bridgeRows() {
    for (let i=0; i<Math.abs(deltaRow); i++)
    {
      const keyCell = s[0] + i * Math.max(Math.min(deltaRow,1),-1)
      if (CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]] === '0') {
        CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]] = '#' // brdgId+'#'
      }
    }
  }
  function bridgeColumns() {
    for (let i=0; i<Math.abs(deltaCol); i++)
    {
      const keyCell = s[1] + i * Math.max(Math.min(deltaCol,1),-1)
      if (CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell] === '0') {
        CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell] = '#' // brdgId+'#'
      }
      // else { console.log('⊡', [s[0]][keyCell]) }
      // console.log('is 0',CorridorReturnObject.CorridorAutomata[0][s[0]][keyCell])
      // console.log('->', e[0], keyCell)
    }
  }
  bridgeRows()
  bridgeColumns()
  // console.log('deltaRow, deltaCol', deltaRow, deltaCol)
  // if (deltaRow > deltaCol) { // bridge vertical first

  // }
}
  //apply access points
for(let i = 0; i < corridorMapIndexes.length; i++){
// console.log('co', corridorMapIndexes[i]))
const bridgeSpan = [
  FloodFillArguments.RoomEgress[corridorMapIndexes[i][0]],
  FloodFillArguments.RoomEgress[corridorMapIndexes[i][1]],
  i // for debug
]
createBridge(bridgeSpan)
}


console.log('corridorMapIndexes', corridorMapIndexes)
console.log('AFTER')
CorridorReturnObject.CorridorAutomata[0].forEach((row: string[]) => console.log(...row))

// deno run Corridor/corridor.ts $(deno run FloodFill/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 100 11))  <-- seed with a replaced shuffled value
// deno run Corridor/corridor.ts $(deno run FloodFill/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 100 12))  <-- seed needing 7 connections
const CorridorReturnObject: {
//   seedArg?:number,
//   verifySeed?:number,
//   RoomAmount?:number,
//   FloodFilledAutomata?:Array<Array<string[]>>
} = {}
const FloodFillArguments = JSON.parse(Deno.args[0])
// console.log('FloodFillArguments', FloodFillArguments.RoomAmount)

const cooridorMapIndexes:Array<number[]> = []
FloodFillArguments.RoomAmount.map((rm: any) => {
  let shuffleIndexes =  (FloodFillArguments.verifySeed).toString(2) + ''
  while (shuffleIndexes.split('').length < FloodFillArguments.FloodFilledAutomata[0].length) {
    shuffleIndexes += '' + shuffleIndexes
  }
  shuffleIndexes = shuffleIndexes.slice(0,FloodFillArguments.FloodFilledAutomata[0].length)
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
    cooridorMapIndexes.push([rm, hasShuffled[indx]])
  })

  return hasShuffled
})
console.log('cooridorMapIndexes', cooridorMapIndexes)
console.log('TODO: Make pathhs from open areas based on MapIndexes')
// console.log('FloodFillArguments.RoomAmount', FloodFillArguments.FloodFilledAutomata)

// FloodFillArguments.FloodFilledAutomata[0].forEach((row: string[]) => console.log(...row))

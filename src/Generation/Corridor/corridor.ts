// deno run Corridor/corridor.ts $(FloodFill/floodfill.ts $(deno run ./CellularAutomata/cellular_automata.ts 20 20 100 12))

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
  
  const shuffleArray = (arr:any) => {
    console.log('arr', arr)
    for (let i = arr.length - 1; i > 0; i--) {
      const j =  parseInt(shuffleIndexedArr?.shift() || '0',10)
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
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
// console.log('FloodFillArguments.RoomAmount', FloodFillArguments.RoomAmount)
// console.log('coridor', corridorMappings())

// const shuffledRooms = [...Array(10).keys()]
// console.log('shuffledRooms', shuffledRooms)
// const shuffleArray = array => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     const temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//   }
// }
// [array[i], array[j]] = [array[j], array[i]];

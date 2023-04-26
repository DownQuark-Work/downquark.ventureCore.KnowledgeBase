import * as Manager from './seed.manager.ts'

let fullSeed = ''
export const getFullSeed = () => fullSeed

// for SSR the default will automatically be called whith the rpos sent in from the GET params.
// both key and value will always be strings
// handle future requests from the default
export default function seedDefault (props:any) {
  const seedProps = JSON.parse(props)
  const gridDims:{[k:string]:number} = JSON.parse(decodeURI(seedProps.gridDimensions))
  const gridCellCount:number = Object.values(gridDims).reduce((a,c)=>a*c,1)
  const seedHash = Manager.SeedHash.numerical(JSON.parse(props).seedVal)
  const hsh = parseInt(seedHash.substring(0,12),10)
  const rngNext = Manager.PRNGenerator.chaotic(hsh)
  let seededString = ''
  while (seededString.length < gridCellCount) seededString += rngNext()
  fullSeed = seededString
  // console.log('seededString, fullSeed.length: ', seededString, fullSeed.length)
  //seededString
  return JSON.stringify({SeededString:seededString})
}

import {initCellularAutomata, applyFloodFill, createCorridors} from '../../_modules/_deno.ts'

export const generateDungeon:(x:{gw:number,gh:number,sa:number,ir:number}, cb?:()=>void) => void = ({gw, gh, sa, ir}, cb = ()=>{}) => {
  const dungeonAutomata = initCellularAutomata({gw, gh, sa, ir})
  const dungeonRooms = dungeonAutomata.CellularAutomata && applyFloodFill(dungeonAutomata.CellularAutomata, (dungeonAutomata.seedArg || 0), (dungeonAutomata.verifySeed || 0))
  const dungeonCorridor =  createCorridors(dungeonRooms)
  const dungeon = dungeonCorridor.CorridorAutomata[0]

  const dungeonMap = document.getElementById('game')
  if (dungeonMap) dungeonMap.innerHTML = ''
  
  let dungeonMapString = ''
  dungeonMap && dungeon.forEach((row: string[],indx:number) => {
    row.forEach((i,idx) => {
      dungeonMapString += `<span data-point="${idx}|${indx}" data-point-type="`
      dungeonMapString += i === '#' ? 'bridge">&nbsp;' : /⊡|^1$/g.test(i) ? 'on">&nbsp;' : 'off">&nbsp;'
      // dungeonMapString += i === '#' ? 'bridge">&nbsp;' : /⊡|^1$/g.test(i) ? 'on" data-point-variant="water">&nbsp;' : 'off" data-point-variant="water">&nbsp;'
      dungeonMapString += `</span>`
    })
    dungeonMapString += '<br />'
  })
  if (dungeonMap) dungeonMap.innerHTML = dungeonMapString
  cb && cb()
}
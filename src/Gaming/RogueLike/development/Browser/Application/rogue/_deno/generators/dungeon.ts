import {initCellularAutomata} from '../../../../../../../../Generation/CellularAutomata/cellular_automata.ts'
import {applyFloodFill} from '../../../../../../../../Generation/_utils/floodfill.ts'
import {createCorridors} from '../../../../../../../../Generation/_utils/corridor.ts'
// import {renderGrid} from '../../../../../../../../Generation/_utils/cli-view.ts'

export const generateDungeon:(x:{gw:number,gh:number,sa:number,ir:number}, cb?:()=>void) => void = ({gw, gh, sa, ir}, cb = ()=>{}) => {
  console.log('??',document?.getElementById('generate-button')?.getAttribute('disabled'))
  console.log('??',document?.getElementById('generate-button')?.setAttribute('disabled','true'))
  console.log('generating with {gw, gh, sa, ir}', {gw, gh, sa, ir})
  const dungeonAutomata = initCellularAutomata({gw, gh, sa, ir})
  const dungeonRooms = dungeonAutomata.CellularAutomata && applyFloodFill(dungeonAutomata.CellularAutomata, (dungeonAutomata.seedArg || 0), (dungeonAutomata.verifySeed || 0))
  const dungeonCorridor =  createCorridors(dungeonRooms)
  const dungeon = dungeonCorridor.CorridorAutomata[0]
  // console.log('DUNGEON CA', dungeonAutomata)
  // console.log('DUNGEON FFA', dungeonRooms)
  // console.log('DUNGEON', dungeon)

  // TODO: Clone array so below would work instead of showing the same pointer
  // dungeonAutomata.CellularAutomata?.[0] && renderGrid(dungeonAutomata.CellularAutomata[0], true)
  // console.log('--------')
  // dungeonRooms?.FloodFilledAutomata?.[0] && renderGrid(dungeonRooms.FloodFilledAutomata[0], true)
  // console.log('--------')
  // renderGrid(dungeon)

  const dungeonMap = document.getElementById('game')
  if (dungeonMap) dungeonMap.innerHTML = ''
  
  let dungeonMapString = ''
  dungeonMap && dungeon.forEach((row: string[],indx:number) => {
    row.forEach((i,idx) => {
      dungeonMapString += `<span data-point="${idx}|${indx}" data-point-type="`
      dungeonMapString += i === '#' ? 'bridge">&nbsp;' : /⊡|^1$/g.test(i) ? 'on">&nbsp;' : 'off">&nbsp;'
      dungeonMapString += `</span>`
    })
    dungeonMapString += '<br />'
  })
  if (dungeonMap) dungeonMap.innerHTML = dungeonMapString
  cb && cb()
}
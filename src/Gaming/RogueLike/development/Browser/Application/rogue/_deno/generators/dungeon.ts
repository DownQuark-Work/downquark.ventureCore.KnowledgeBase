import {initCellularAutomata} from '../../../../../../../../Generation/CellularAutomata/cellular_automata.ts'
import {applyFloodFill} from '../../../../../../../../Generation/_utils/floodfill.ts'
import {createCorridors} from '../../../../../../../../Generation/_utils/corridor.ts'
import {renderGrid} from '../../../../../../../../Generation/_utils/cli-view.ts'

export const generateDungeon:(x:{gw:number,gh:number,sa:number,ir:number}) => void = ({gw, gh, sa, ir}) => {
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
  
  // TODO: this can be much more efficient - but keep a ref to gRow for memo as components are all moved around
  dungeonMap && dungeon.forEach((row: string[],indx:number) => {
    const graphics = row.map(i => i === '#' ? '#' : /⊡|^1$/g.test(i) ? 'X' : '&nbsp;')
    graphics.forEach(char => dungeonMap.innerHTML = dungeonMap.innerHTML + char)
    dungeonMap.innerHTML = dungeonMap.innerHTML + '<br />'
  })
}
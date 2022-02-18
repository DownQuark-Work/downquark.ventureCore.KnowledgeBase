import {initCellularAutomata} from '../../../../../../../../Generation/CellularAutomata/cellular_automata.ts'
import {applyFloodFill} from '../../../../../../../../Generation/_utils/floodfill.ts'
import {createCorridors} from '../../../../../../../../Generation/_utils/corridor.ts'

export const generateDungeon:(x:{gw:number,gh:number,sa:number,ir:number}) => void = ({gw, gh, sa, ir}) => {
  const dungeonAutomata = {...initCellularAutomata({gw, gh, sa, ir})}
  const dungeonRooms = dungeonAutomata.CellularAutomata && applyFloodFill(dungeonAutomata.CellularAutomata, (dungeonAutomata.seedArg || 0), (dungeonAutomata.verifySeed || 0)) || [[['No Cellular Automata Processed']]]
  const dungeon =  createCorridors(dungeonRooms)
  console.log('DUNGEON CA', dungeonAutomata)
  console.log('DUNGEON FFA', dungeonRooms)
  console.log('DUNGEON', dungeon)
}
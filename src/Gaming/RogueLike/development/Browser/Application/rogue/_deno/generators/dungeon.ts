import {initCellularAutomata} from '../../../../../../../../Generation/CellularAutomata/cellular_automata.ts'
import {applyFloodFill} from '../../../../../../../../Generation/_utils/floodfill.ts'

export const generateDungeon:(x:{gw:number,gh:number,sa:number,ir:number}) => void = ({gw, gh, sa, ir}) => {
  const dungeonAutomata = {...initCellularAutomata({gw, gh, sa, ir})}
  const floodFilledMap = dungeonAutomata.CellularAutomata && applyFloodFill(dungeonAutomata.CellularAutomata, (dungeonAutomata.seedArg || 0), (dungeonAutomata.verifySeed || 0)) || [[['No Cellular Automata Processed']]]
  console.log('DUNGEON CA', dungeonAutomata)
  console.log('DUNGEON FFA', floodFilledMap)
}
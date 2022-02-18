import {initCellularAutomata} from '../../../../../../../../Generation/CellularAutomata/cellular_automata.ts'

export const generateDungeon:(x:{gw:number,gh:number,sa:number,ir:number}) => void = ({gw, gh, sa, ir}) => {
  initCellularAutomata({gw, gh, sa, ir})
}
// deno bundle -c deno.jsonc ./ui/controls.generators.ts ../js/rogue/generate.dungeon.bundle.js
// import {initCellularAutomata} from '../../../../../../../../Generation/CellularAutomata/cellular_automata.ts'
import {generateDungeon} from '../generators/dungeon.ts'

const setCellularAutomataArgs = () => {
  // TODO: get values from form fields so they can be updated @ runtime
  generateDungeon({gw:35, gh:20, sa:13, ir:12})
}

(document.getElementById('grid-config') as HTMLDivElement).innerHTML = JSON.stringify({gw:35, gh:20, sa:13, ir:12})
typeof document !== 'undefined' && document?.getElementById('generate-button')?.addEventListener('click',setCellularAutomataArgs)

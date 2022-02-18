// deno bundle -c deno.jsonc ./ui/controls.generators.ts ../js/rogue/generate.dungeon.bundle.js
import {initCellularAutomata} from '../../../../../../../../Generation/CellularAutomata/cellular_automata.ts'

if(typeof document !== 'undefined' && document?.getElementById('grid-config')){
  (document.getElementById('grid-config') as any).innerHTML = JSON.stringify({gw:35, gh:20, sa:13, ir:12})
}
typeof document !== 'undefined' && document?.getElementById('generate-button')?.addEventListener('click',initCellularAutomata)
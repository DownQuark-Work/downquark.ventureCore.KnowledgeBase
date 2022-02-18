// deno bundle -c deno.jsonc ./ui/controls.generators.ts ../js/rogue/generate.dungeon.bundle.js
import {generateDungeon} from '../generators/dungeon.ts'

const setCellularAutomataArgs = () => {
  document?.getElementById('generate-button')?.setAttribute('disabled','true')
  console.log('??',document?.getElementById('generate-button')?.getAttribute('disabled'))
  const generatorArgs: {[k:string]:number} = { gw: 0, gh: 0, sa: 0, ir: 0, }
  const spans = (document.querySelectorAll('[data-gen-attr]') as NodeListOf<HTMLSpanElement>)
  spans.forEach(arg => {
    generatorArgs[arg.dataset.genAttr || 'gw'] = parseInt(arg.innerText,10)
  })

  // TODO: get values from form fields so they can be updated @ runtime
  generateDungeon(({...generatorArgs} as { gw: number; gh: number; sa: number; ir: number; }), () => {console.log('called');document?.getElementById('generate-button')?.removeAttribute('disabled')})
  console.log('XX??',document?.getElementById('generate-button')?.getAttribute('disabled'))
}
(document.querySelector('span[data-gen-attr="sa"]') as HTMLSpanElement).innerText = new Date().getTime().toString()
typeof document !== 'undefined' && document?.getElementById('generate-button')?.addEventListener('click',setCellularAutomataArgs)

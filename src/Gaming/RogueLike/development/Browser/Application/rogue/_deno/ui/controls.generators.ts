// deno bundle -c deno.jsonc ./ui/controls.generators.ts ../js/rogue/generate.dungeon.bundle.js
// nethack is 63x18 || 73x19
import {generateDungeon} from '../generators/dungeon.ts'

const createSeedHash = () => {
  const hashSeed = new Date().getTime().toString()
  window.location.hash = hashSeed
}
const setCellularAutomataArgs = () => {
  document?.getElementById('generate-button')?.setAttribute('disabled','true')
  const generatorArgs: {[k:string]:number} = { gw: 0, gh: 0, sa: 0, ir: 0, }
  const spans = (document.querySelectorAll('[data-gen-attr]') as NodeListOf<HTMLSpanElement>)
  spans.forEach(arg => {
    generatorArgs[arg.dataset.genAttr || 'gw'] = parseInt(arg.innerText,10)
  })

  if(!generatorArgs.sa) // update hash in url so we can grab if needed
  {
    createSeedHash()
    generatorArgs.sa = parseInt(window.location.hash.replace('#',''))
  }

  generateDungeon(({...generatorArgs} as { gw: number; gh: number; sa: number; ir: number; }), () => {document?.getElementById('generate-button')?.removeAttribute('disabled')})
}
if(!window.location.hash) { createSeedHash() }
(document.querySelector('span[data-gen-attr="sa"]') as HTMLSpanElement).innerText = window.location.hash.replace('#','')

typeof document !== 'undefined' && document?.getElementById('generate-button')?.addEventListener('click',setCellularAutomataArgs)

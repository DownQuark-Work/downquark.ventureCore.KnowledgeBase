// deno bundle -c deno.jsonc ./ui/controls.generators.ts ../js/rogue/generate.dungeon.bundle.js
// nethack is 63x18 || 73x19
import {generateDungeon} from '../ecsx/entity/dungeon.ts'

const createSeedHash = (s = null) => {
  const hashSeed = s || new Date().getTime().toString()
  window.location.hash = hashSeed
}
export const setCellularAutomataArgs = () => {
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
  const seedInputText = (document.querySelector('span[data-gen-attr="sa"]') as HTMLSpanElement).innerText
  if( seedInputText.length && window.location.hash !== '#' + seedInputText) // reflect manual seed update
  { window.location.hash = (document.querySelector('span[data-gen-attr="sa"]') as HTMLSpanElement).innerText}

  generateDungeon(({...generatorArgs} as { gw: number; gh: number; sa: number; ir: number; }), () => {document?.getElementById('generate-button')?.removeAttribute('disabled')})
}
if(!window.location.hash) { createSeedHash() }
(document.querySelector('span[data-gen-attr="sa"]') as HTMLSpanElement).innerText = window.location.hash.replace('#','')

if(typeof document !== 'undefined') {
  document?.getElementById('generate-button')?.addEventListener('click',setCellularAutomataArgs)
  document?.getElementById('generate-random-button')?.addEventListener('click',() => {
    (document.querySelector('span[data-gen-attr="sa"]') as HTMLSpanElement).innerText = ''
    setCellularAutomataArgs()
  })
  document?.querySelectorAll('li')?.forEach(li => li.addEventListener('click',(e) => {
    const seedit = (e.target as HTMLLIElement)?.innerText.split(' ')
    const spans = (document.querySelectorAll('[data-gen-attr]') as NodeListOf<HTMLSpanElement>)
    seedit.forEach((sd,indx) => {
      spans[indx].innerText = sd
    })
    setCellularAutomataArgs()
  }))
}
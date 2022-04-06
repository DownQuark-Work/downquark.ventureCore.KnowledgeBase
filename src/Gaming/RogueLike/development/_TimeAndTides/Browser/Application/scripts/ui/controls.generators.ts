// deno bundle -c deno.jsonc ./ui/controls.generators.ts ../js/rogue/generate.dungeon.bundle.js
// nethack is 63x18 || 73x19
import {generateDungeon} from '../ecsx/entity/dungeon.ts'
import {generateMaze} from '../ecsx/entity/maze.ts'

const createSeedHash = (s = null) => {
  const hashSeed = s || new Date().getTime().toString()
  window.location.hash = hashSeed
}
export const setGeneratorArgs = () => {
  const generatorType = (document.querySelector('h3[data-generator-type]') as HTMLHeadingElement)?.dataset?.generatorType
  const generatorArgs: {[k:string]:number} = { gw: 0, gh: 0, sa: 0, ir: 0, }
  const spans = (document.querySelectorAll('[data-gen-attr]') as NodeListOf<HTMLSpanElement>)
  console.log('spans', spans)
  spans.forEach(arg => {
    (generatorArgs[arg.dataset.genAttr || 'gw'] as any) = !isNaN(parseInt(arg.innerText,10)) ? parseInt(arg.innerText,10) : arg.innerText
  })

  if(!generatorArgs.sa) // update hash in url so we can grab if needed
  {
    createSeedHash()
    generatorArgs.sa = parseInt(window.location.hash.replace('#',''))
  }
  const seedInputText = (document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText
  if( seedInputText.length && window.location.hash !== '#' + seedInputText) // reflect manual seed update
  { window.location.hash = (document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText}

  switch (generatorType) {
    case 'maze':
      console.log('generatorArgs', generatorArgs)
      console.log('TODO: Implement below and get graphical');
      // console.log('generateMaze({gw:12, gh:8})', generateMaze({gw:12, gh:8}))
      console.log('generateMaze({gw:12, gh:8, algorithm:SIDEWINDER})', generateMaze({gw:12, gh:8, algorithm:'RENDER_MAZE.WITH_SIDEWINDER'}))
      break
    default:
      generateDungeon(({...generatorArgs} as { gw: number; gh: number; sa: number; ir: number; }))
  }
}
if(!window.location.hash) { createSeedHash() }
(document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText = window.location.hash.replace('#','')

if(typeof document !== 'undefined') {
  document?.getElementById('generate-button')?.addEventListener('click',setGeneratorArgs)
  document?.getElementById('generate-random-button')?.addEventListener('click',(e) => {
    (document.querySelector('span[data-gen-attr^="s"]') as HTMLSpanElement).innerText = ''
    setGeneratorArgs()
    console.log( '{e}', {e}, (e?.target as HTMLSpanElement)?.dataset?.type )
  })
  document?.querySelectorAll('li')?.forEach(li => li.addEventListener('click',(e) => {
    const seedit = (e.target as HTMLLIElement)?.innerText.split(' ')
    const spans = (document.querySelectorAll('[data-gen-attr]') as NodeListOf<HTMLSpanElement>)
    seedit.forEach((sd,indx) => {
      spans[indx].innerText = sd
    })
    setGeneratorArgs()
  }))
}
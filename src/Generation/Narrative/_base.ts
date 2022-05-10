// deno run --allow-read --allow-write Narrative/_base.ts -s 13 -n 3 -t word -r 3,7 --src abc,def
// deno run --allow-read --allow-write Narrative/_base.ts -n 2 -t word -r 7,12 -s 165210
import { parse } from '../_utils/_deps.ts'
import {parseSeed, seedPointer} from '../_utils/_seed.ts'

import { ngrams, ngramths } from './ngram.ts'
import { markovChain } from './markov.ts'
import FROZEN_PIRATE from './_txt/FrozenPirate.ts'
import THE_PIRATE from './_txt/ThePirate.ts'

const _DEBUG = false

let nGramText = ''
const markovReturnObj = {
  nGramValue: 0,
  seed: 0,
  markovRange: [0,0],
  sources: [''],
  type: 'markov',
}

const setDefaultMarkovObject = () => {
  nGramText = THE_PIRATE+' '+FROZEN_PIRATE
  markovReturnObj.nGramValue = 3
}

const createNGram = () => {
  const filterShort = (wrd:string) => wrd.replace(/\W/g,'').length > 2
  // const mapBacon = (wrd:string) => wrd.replace('piggy','bacon')
  const mutateFncs = {
    filter: [(_:string)=>true],
    map: []
  }

  let ngramObj
  if(markovReturnObj.type === 'word') {
    mutateFncs['filter'].push(filterShort)
    ngramObj = ngramths({n:markovReturnObj.nGramValue, src:nGramText, mutateFncs})
  } else { ngramObj = ngrams({n:markovReturnObj.nGramValue, src:nGramText}) }

  const {markovRange, type} = markovReturnObj
  markovChain(ngramObj, markovRange, type)
}

const determineMarkovText = async () => {
  const convertMarkovText = async () => {
    _DEBUG && console.log('markovReturnObj.sources', markovReturnObj.sources)
    // TODO(@mlnck): DRY THIS
    const srcs = [...markovReturnObj.sources]
    let errorless = true
    while(errorless && srcs.length) {
      const curSrc = srcs.shift()
      try {
        let tryRead = await Deno.readTextFile(`./Narrative/_txt/${curSrc}.txt`) // must be relative from CLI
        tryRead = `export const ${(curSrc as string).toUpperCase().replace(/\s/g,'_')}=\`${tryRead.replace(/`/g,'')}\``
        await Deno.writeTextFile(`./Narrative/_txt/_parsed/${curSrc}.ts`, tryRead)
        _DEBUG && console.log('file written: ', `./Narrative/_txt/${curSrc}.ts`)
        nGramText += tryRead + ' '
      } catch (err) {
        errorless = false
        _DEBUG && console.log('Read ERROR: ', err)
      }
    }
    Promise.resolve()
  }
  

  const importedTexts: {[_:string]: any} = {}
  const srcs = [...markovReturnObj.sources]
  let errorless = true
  while(errorless && srcs.length) {
    const curSrc = srcs.shift()
    try {
      const tryLoad = await import(`./_txt/_parsed/${curSrc}.ts`)
      importedTexts[(curSrc as string).toUpperCase().replace(/\s/g,'_')] = tryLoad
    } catch (err) {
      errorless = false
      _DEBUG && console.log('LOAD ERROR: ', err)
    }
  }
  
  if(!errorless && typeof Deno !== 'undefined'){ await convertMarkovText() }

  Object.entries(importedTexts).forEach(entry => {
    nGramText += entry[1][entry[0]] + ' '
  })

  if(!nGramText.length){ setDefaultMarkovObject() }
  createNGram() 
}
const instantiate = (denoProps:any = null, browserProps:any = null) => {
  const {
    n: nGramValue = 3,
    s: seed = new Date().getTime(),
    r: markovRange = '5,10',
    t: type = 'markov', // word, sentence, title, paragraph, page
    src: sources = ''
  } = denoProps || browserProps

    markovReturnObj.markovRange = markovRange.split(',').map((s: string) => parseInt(s,10))
    markovReturnObj.nGramValue = nGramValue
    markovReturnObj.seed = seed
    markovReturnObj.sources = sources.split(',')
    markovReturnObj.type = type

  seedPointer(0)
  parseSeed(markovReturnObj.seed,300)
  seedPointer.inc() // needed to instantiate seed parsing
  console.log('markovReturnObj', markovReturnObj)
  determineMarkovText()
}

(typeof Deno !== 'undefined') && instantiate(parse(Deno.args)) // CLI
export const newMarkov = (markovInitProps:any) => {
  markovInitProps.markovRange = markovInitProps?.markovRange.join('') || null
  instantiate(null, markovInitProps)
  return markovReturnObj
} // Browser
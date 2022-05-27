// See ReadMe for details
// TODO(@mlnck) DRY the generateNgram(th) methods

type MutateFncsType = {
  filter?: any[],
  map?: any[]
}
type MutateFncsTypeType = 'filter'|'map'

// Common
let createCleanTextArrayMemo:string[]
const createCleanTextArray = (txt: string) => {
  createCleanTextArrayMemo = txt.replace(/[^\w\s-]|_/g,'').replace(/\d/g,'').replace(/-/g,' ').replace(/\s\s+/g,' ')
                                  .replace(/\s/g,'~!~').replace(/(~!~){2,}/g,'~!~')
                                  .replace('^~!~','').replace('~!~$','').toLowerCase().split('~!~')
  return createCleanTextArrayMemo
}

const getSentenceBookends = ({src = ''}) => [...src.matchAll(/(\w+)[.?!]\s+(\w+)/g)].reduce((a:string[][],c) => {
  a[0].push(c[1].toLowerCase())
  a[1].push(c[2].toLowerCase())
  return [
    [...new Set(a[0])],
    [...new Set(a[1])]
  ]
}, [[],[]])

const iterateMutateFncs = (src:string, mutateFnc:MutateFncsType) => {
  let srcArray:string[]
  function *applyMutateFncs() {
    for (const mutateType of Object.keys((mutateFnc as MutateFncsType))) {
      for (const filterFn of (mutateFnc?.[(mutateType as MutateFncsTypeType)] as any[])) {
        yield (srcArray[(mutateType as MutateFncsTypeType)] as any)(filterFn)
      }
    }
  }
  srcArray = src.split(/\s/)
  for(const filteredTextArr of applyMutateFncs()){
    srcArray = (filteredTextArr as unknown as string[])
  }
  return srcArray.join(' ')
}
// End Common

export const ngrams = ({n=1, src='', mutateFncs}:{n?:number, src:string, mutateFncs?:MutateFncsType}) => { // n-gram defaults to single word-level
  if (!src.length) return
  if(mutateFncs) src = iterateMutateFncs(src, mutateFncs)

  const generateNgram = ({n=1, text = ''}:{n:number, text:string}) => {
    const ng:{[k:string]:{[k:string]:number}} = {_stats:{}}
    const txtArr = createCleanTextArrayMemo || createCleanTextArray(text)

    const ngramKey = txtArr.slice(0,n-1)
    ngramKey.unshift('ALLOWS_NON-CONDITIONAL_LOOP')

    // TODO(@mlnck): refactor - all first level keys should be a single for efficiency / matching / lookup / etc
    /* // for n =3 the obj would look like
      {
        one: {
          'of the':2,
          'of those':3
        }
        of: { // this whole block gets ignored
          'the things':1,
          'the others':3,
          'those amazing':2,
          'those birds':1,
          'those bastards':2,
        },
        the: { // this key could match
          'big house':1,
          'summer sun':2,
          'top one':1,
        }
        those: { // this key could match
          'amazing kids':1,
          'amazing fireballs':1,
          'birds circled':1,
          'bastards cried':2,
          'bastards shouted':3,
        }
      }
      // output could be:
      - one of the summer sun
      - one of those bastards shouted
      - one of the top one of those birds circled
    */
    
    const txtArrLen = txtArr.length
    for(let indx=n-1; indx<txtArrLen; indx++) {
      ngramKey.shift()
      ngramKey.push(txtArr[indx])
      const txtKey = ngramKey.join(' ')
      const insertTxt = txtArr[indx+1] || ''
      if(insertTxt.length) {
        if(!ng[txtKey]) ng[txtKey] = {}
        if(ng[txtKey]?.[insertTxt]) ng[txtKey][insertTxt] = ng[txtKey][insertTxt] + 1
        else if(!ng[txtKey]?.[insertTxt]) ng[txtKey][insertTxt] = 1
      }
    }
    ng['_stats']['_length'] = txtArrLen
    return ng
  }
  // having the {text:src} hash below if we want to extend/export/etc in the future
  const ngram = generateNgram({n, text:src})
  const [sentenceFirsts, sentenceLasts] = getSentenceBookends({src})

  return {
    ngram,
    sentenceFirsts, sentenceLasts
  }
}

export const ngramths = ({n=1, src='', mutateFncs}:{n?:number, src:string, mutateFncs?:MutateFncsType}) => {
  if (!src.length) return
  if(mutateFncs) src = iterateMutateFncs(src, mutateFncs)

  const generateNgramth = ({n=1, text = ''}:{n:number, text:string}) => {
    const ngth:{[k:string]:{[k:string]:number}} = {}
    const txtArr = [...new Set(createCleanTextArray(text))]
  
    for(let idx=0; idx<txtArr.length; idx++) {
      const id = idx
      const txtWord = txtArr[id]
      
      let ngramthKey = 'X'+txtArr[idx].slice(0,n-1) // `?` functions as ALLOWS_NON-CONDITIONAL_LOOP in above loop
      for(let indx=n-1; indx<txtWord.length; indx++) {
        const inx = indx
        ngramthKey = ngramthKey.substr(1)
        ngramthKey += txtWord[inx]
        const txtKey = ngramthKey
        const insertTxt = txtWord[inx+1] || ''
        if(insertTxt.length) {
          if(!ngth[txtKey]) ngth[txtKey] = {}
          if(ngth[txtKey]?.[insertTxt]) ngth[txtKey][insertTxt] = ngth[txtKey][insertTxt] + 1
          else if(!ngth[txtKey]?.[insertTxt]) ngth[txtKey][insertTxt] = 1
        }
      }
    }
    return ngth
  }
  const ngramth = generateNgramth({n, text:src})

  const [sentenceFirsts, sentenceLasts] = getSentenceBookends({src})
  // console.log('sentenceFirsts', sentenceFirsts)
  const _bow:{[k:string]:number} = {}
  const _eow:{[k:string]:number} = {}
  sentenceFirsts.forEach(firstWord => {
    const firstChars = firstWord.substr(0,n).replace(/[\d\W_]/g,'')
    if(firstChars.length === n) {
      if(_bow[firstChars]) _bow[firstChars] = _bow[firstChars] + 1
      else if(!_bow[firstChars]) _bow[firstChars] = 1
    }
  })
  sentenceLasts.forEach(lastWord => {
    const lastChars = lastWord.substr(n*-1,n).replace(/[\d\W_]/g,'')
    if(lastChars.length === n) {
      if(_eow[lastChars]) _eow[lastChars] = _eow[lastChars] + 1
      else if(!_eow[lastChars]) _eow[lastChars] = 1
    }
  })
  const bowSum = Object.values(_bow).reduce((a,c) => a+c, 0)
  const bowLen = Object.values(_bow).length
  const eowSum = Object.values(_eow).reduce((a,c) => a+c, 0)
  const eowLen = Object.values(_eow).length
  _bow['_length'] = bowLen
  _bow['_sum'] = bowSum
  _eow['_length'] = eowLen
  _eow['_sum'] = eowSum

  return {
    ngramth,
    _bow,
    _eow,
  }
}

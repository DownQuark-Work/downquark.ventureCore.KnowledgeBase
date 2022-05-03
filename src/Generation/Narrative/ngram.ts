// See ReadMe for details
// TODO(@mlnck) DRY the generateNgram(th) methods

type MutateFncsType = {
  filter: any[],
  map: any[]
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
    
    const ngramthKey = [txtArr[0].slice(0,n-1)]
    ngramthKey.unshift('ALLOWS_NON-CONDITIONAL_LOOP')

    for(let idx=0; idx<txtArr.length; idx++) {
      const txtWord = txtArr[idx]
      for(let indx=n-1; indx<txtWord.length; indx++) {
        ngramthKey.shift()
        ngramthKey.push(txtWord[indx])
        const txtKey = ngramthKey.join('')
        const insertTxt = txtWord[indx+1] || ''
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

  const [_sentenceFirsts, sentenceLasts] = getSentenceBookends({src})
  const _eow:{[k:string]:number} = {}
  sentenceLasts.forEach(lastWord => {
    const lastChars = lastWord.substr(n*-1,n)
    if(_eow[lastChars]) _eow[lastChars] = _eow[lastChars] + 1
    else if(!_eow[lastChars]) _eow[lastChars] = 1
  })
  const eowSum = Object.values(_eow).reduce((a,c) => a+c, 0)
  const eowLen = Object.values(_eow).length
  _eow['_length'] = eowLen
  _eow['_sum'] = eowSum
  console.log('Object.values(_eow).length', Object.values(_eow).length)

  return {
    ngramth,
    _eow
  }
}

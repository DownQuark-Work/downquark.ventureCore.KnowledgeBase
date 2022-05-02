// See ReadMe for details

type MutateFncsType = {
  filter: any[],
  map: any[]
}
type MutateFncsTypeType = 'filter'|'map'
export const ngrams = ({n=1, src='', mutateFncs}:{n:number, src:string, mutateFncs?:MutateFncsType}) => { // n-gram defaults to single word-level
  if (!src.length) return

  let srcArray = src.split(/\s/)
  function *applyMutateFncs() {
    for (const mutateType of Object.keys((mutateFncs as MutateFncsType))) {
      for (const filterFn of (mutateFncs?.[(mutateType as MutateFncsTypeType)] as any[])) {
        yield (srcArray[(mutateType as MutateFncsTypeType)] as any)(filterFn)
      }
    }
  }
  if(mutateFncs) {
    for(const filteredTextArr of applyMutateFncs()){
      srcArray = (filteredTextArr as unknown as string[])
    }
    src = srcArray.join(' ')
  }

  const getSentenceBookends = ({src = ''}) => [...src.matchAll(/(\w+)[.?!]\s+(\w+)/g)].reduce((a:string[][],c) => {
    a[0].push(c[1].toLowerCase())
    a[1].push(c[2].toLowerCase())
    return [
      [...new Set(a[0])],
      [...new Set(a[1])]
    ]
  }, [[],[]])

  const generateNgram = ({n=1, text = ''}:{n:number, text:string}) => {
    const ng:{[k:string]:{[k:string]:number}} = {}
    const cleanTxt = text.replace(/[^\w\s-]|_/g,'').replace(/\s/g,'~!~').replace(/(~!~){2,}/g,'~!~').replace('^~!~','').replace('~!~$','').toLowerCase()
    const txtArr = cleanTxt.split('~!~')

    const ngramKey = txtArr.slice(0,n-1)
    ngramKey.unshift('ALLOWS_NON-CONDITIONAL_LOOP')
  
    for(let indx=n-1; indx<txtArr.length; indx++) {
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

export const ngramths = () => {
  console.log('TODO: ~~~> DO THIS NOW <~~~')
}

// See ReadMe for deetails

export const ngrams = ({n=1, src=''}) => { // n-gram defaults to single word-level (can extend to character level if desired later on)
  if (!src.length) return

  const ngram:{[k:string]:{[k:string]:number}} = {}
  const generateNgram = ({n=1, text =''}) => {
    const cleanTxt = text.replace(/[^\w\s-]|_/g,'').replace(/\s/g,'~!~').replace(/(~!~){2,}/g,'~!~').replace('^~!~','').replace('~!~$','').toLowerCase()
    const txtArr = cleanTxt.split('~!~')

    const ngramKey = txtArr.slice(0,n-1)
    ngramKey.unshift('ALLOWS_NON-CONDITIONAL_LOOP')
  
      for(let indx=n-1; indx<txtArr.length; indx++) {
        ngramKey.shift()
        ngramKey.push(txtArr[indx])
        console.log('ngramKey', ngramKey)
      const txtKey = ngramKey.join(' ')
      const insertTxt = txtArr[indx+1] || ''
      if(insertTxt.length) {
        if(!ngram[txtKey]) ngram[txtKey] = {}
        if(ngram[txtKey]?.[insertTxt]) ngram[txtKey][insertTxt] = ngram[txtKey][insertTxt] + 1
        else if(!ngram[txtKey]?.[insertTxt]) ngram[txtKey][insertTxt] = 1
      }
    }
  }
  generateNgram({n, text:src})
}

export const ngramths = () => {console.log('ngramths', ngramths)}

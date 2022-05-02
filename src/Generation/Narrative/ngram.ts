// See ReadMe for deetails

export const ngrams = ({n=1, src=''}) => { // n-gram defaults to single word-level (can extend to character level if desired later on)
  const ngram:{[k:string]:{[k:string]:number}} = {}
  const generateNgram = ({n=1, text =''}) => {
    const cleanTxt = text.replace(/[^\w\s-]|_/g,'').replace(/\s/g,'~!~').replace(/(~!~){2,}/g,'~!~').replace('^~!~','').replace('~!~$','').toLowerCase()
    const txtArr = cleanTxt.split('~!~')
    if (!text.length) return
      for(let indx=n-1; indx<txtArr.length; indx++) {
      const txt = txtArr[indx]
      const insertTxt = txtArr[indx+1] || ''
      if(insertTxt.length) {
        if(!ngram[txt]) ngram[txt] = {}
        if(ngram[txt]?.[insertTxt]) ngram[txt][insertTxt] = ngram[txt][insertTxt] + 1
        else if(!ngram[txt]?.[insertTxt]) ngram[txt][insertTxt] = 1
      }
    }
    console.log('ngram', ngram)
  }
  // console.log('src', src)
  generateNgram({n, text:src})
}

export const ngramths = () => {console.log('ngramths', ngramths)}

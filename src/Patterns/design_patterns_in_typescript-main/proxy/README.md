## Proxy Pattern ##

Provide a surrogate or placeholder for another object to control access to it.

*GOF*

---
## Proxy Chaos Concept ##

a *_very_* minimal one I spun up awhile ago to randomly test for bad returns in the spec suite:
---
_apicall.js_
```javascript
export const ApiCall = async (props) => await fetch(`/API/URL/${props.id}/${props.whatnot}`)
```
_apicall.spec_
```javascript
import {ComponentUsingApiCall} from './ApiComponent'
import {ApiCall as 'ChaosApiCall'} from './apicall'

const INCORRECT_DATA = { name:13, age:'CHAOS: string instead of number'}
// convert to HOC etc and pass in INCORRECT_DATA
const ApiCall = new Proxy(ChaosApiCall, {
  get:(obj,prop) => {
    if(Math.floor(Math.random() * 100) === 1) {
      throw Error('CHAOS: 500 Error')
    }
    if(Math.floor(Math.random() * 100) === 2) {
      console.log('CHAOS: Long response time')
      await setTimeout(()=>obj[prop],5000)
    }
    if(Math.floor(Math.random() * 100) === 3) {
      console.log('CHAOS: Empty result set')
      return {}
    }
    if(Math.floor(Math.random() * 100) === 4) {
      console.log('CHAOS: Incorrect data')
      return INCORRECT_DATA
    }
    // ...etc
    return obj[prop]
  }
})
// spyOn, mock, inject, etc, the ApiCall
mount(ComponentUsingApiCall)
```
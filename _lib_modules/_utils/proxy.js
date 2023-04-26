class _enum {
  constructor(args, startIndex = 0, defaultValue) {
    const em = args.split("|").reduce((m, k, indx) => {
      m[(m[k] = indx + startIndex)] = k
      return m
    }, {})
    em.value = em.key = (k) => em[k]
    return new Proxy(em, {
      get: (obj, prop) => (prop in obj ? obj[prop] : defaultValue),
      set: (obj, prop, value) => {
        if (prop in obj) throw new Error("cant set same value again")
        em[(em[prop] = value)] = prop
      },
    })
  }
}
Proxy.__proto__.Enum = Object.assign(_enum)
/* Usage:
const DOWNLOAD_STATES = new Enum("START|INPROGRESS|FINISHED", 1);
console.log(JSON.stringify(DOWNLOAD_STATES)); // {"1":"START","2":"INPROGRESS","3":"FINISHED","START":1,"INPROGRESS":2,"FINISHED":3}
const { START } = DOWNLOAD_STATES;
console.log(`CURR STATE is ${START}`); // CURR STATE is 1
console.log(`CURR STATE is ${DOWNLOAD_STATES[2]}`); // CURR STATE is INPROGRESS
DOWNLOAD_STATES.IDLE = 4; // ADD new State:
console.log(`CURR STATE is ${DOWNLOAD_STATES[4]}`); // CURR STATE is IDLE
 */

// deno-lint-ignore no-window-prefix
const console = new Proxy(window.console,{
  has: () => false,
  get:(target,prop) => {
    if (!target._debug) return () => {}
    if (Reflect.has(target, prop)) return Reflect.get(target, prop)
    return () => 'no debug method for ' + prop
  },
  set:(target,prop,val) => target[prop] = !!val
})
// console._debug = process.env.NODE_ENV === 'development'
console._debug = /^(127|(0\.){3}|localhost)/g.test(window.location.host)
/*
  console === window.console // false
  console._debug // true [defaults to true on localhost paths]
  console.log(Math.PI) // 3.141592653589793
  console._debug = false
  console.log(Math.PI) // <no output>
  - all original methods are accounted for (e.g.):
  console.trace(1/0)
```
  console.groupCollapsed('group name')
  console.log('a');console.log('a');console.log('a');console.log('a');
  console.groupEnd()
```
*/
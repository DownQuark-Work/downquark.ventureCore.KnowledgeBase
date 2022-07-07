# Integrations
## mixins & decorators
> [mixins](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)
```
// longhand
let Mixin1 = (superclass) => class extends superclass {
  foo() {console.log('foo from Mixin1'); if (super.foo) super.foo();}};
let Mixin2 = (superclass) => class extends superclass {
  foo() {console.log('foo from Mixin2'); if (super.foo) super.foo();}};
class S { foo() { console.log('foo from S')}}
class C extends Mixin1(Mixin2(S)) {foo() { console.log('foo from C'); super.foo()}}
  // below outputs: foo from C, foo from Mixin1, foo from Mixin2, foo from S
new C().foo();

// better syntax
class C extends Mixin1(Mixin2(S)) {} // original
class C extends mix(S).with(Mixin1, Mixin2) {} // updated

// util function
let mix = (superclass) => new MixinBuilder(superclass);
class MixinBuilder {
  constructor(superclass) { this.superclass = superclass; }
  with(...mixins) {  return mixins.reduce((c, mixin) => mixin(c), this.superclass); }
}

// All together
class BaseA { bar() { console.log('BASE_A') } }
const Mxn1 = (suprclss) => class extends suprclss {
  bar() { console.log('MX1'); if(super.bar) super.bar() }}
const Mxn2 = (suprclss) => class extends suprclss {
  bar() { console.log('MX2'); if(super.bar) super.bar() }}
class TopLevel extends mix(BaseA).with(Mxn1, Mxn2) { // composition
  bar() { console.log('TOPLEVEL'); super.bar() }}
// below outputs: TOPLEVEL, MX2, MX1, BASE_A
new TopLevel().bar()
```
> [decorators](https://justinfagnani.com/2016/01/07/enhancing-mixins-with-decorator-functions/)
`@@foo` is shorthand for `Symbol.foo`
```
// https://justinfagnani.com/2016/01/07/enhancing-mixins-with-decorator-functions/#wrappingwithcare
const _originalMixin = Symbol('_originalMixin');
const wrap = (mixin, wrapper) => { // function wrapping behaves a lot more like inheritance
  Object.setPrototypeOf(wrapper, mixin);
  if (!mixin[_originalMixin]) { mixin[_originalMixin] = mixin; }
  return wrapper;
}
// Below: Base mixin decorator that applies the mixin and stores a reference
// // from the mixin application back to the mixin definition for later use in caching:
// NOTE: call to `wrap` sets up so other decorators can add properties & be visible after wrapping
const BaseMixin = (mixin) => wrap(mixin, (superclass) => {
  let application = mixin(superclass);
  application.prototype[_mixinRef] = mixin[_originalMixin];
  return application;
});

// https://justinfagnani.com/2016/01/07/enhancing-mixins-with-decorator-functions/#cachingmixinapplications
const _mixinRef = Symbol('_mixinRef');
const _cachedApplicationRef = Symbol('_cachedApplicationRef');
const Cached = (mixin) => wrap(mixin, (superclass) => {
  let applicationRef = mixin[_cachedApplicationRef];
  if (!applicationRef) { // Create a symbol used to reference a cached application from a superclass
    applicationRef = mixin[_cachedApplicationRef] = Symbol(mixin.name); }
  if (superclass.hasOwnProperty(applicationRef)) 
    { return superclass[applicationRef]; } // Look up an cached application of `mixin` to `superclass`
  let application = mixin(superclass); // Apply the mixin
  superclass[applicationRef] = application; // Cache the mixin application on the superclass
  return application;
});

// overriding the `instanceof` operator via the `@@hasInstance` method
// Implemented by objects that appear on the righthand side of an `instanceof` operator
/* `o instanceof MyMixin`: _TRUE_ if `o` is an instance of a class that has mixed in `MyMixin` */
const HasInstance = (mixin) => {
  if (!Symbol.hasInstance) return mixin
  mixin[Symbol.hasInstance] = function(o) {
    const originalMixin = this[_originalMixin];
    while (o != null) {
      if (o.hasOwnProperty(_mixinRef) && o[_mixinRef] === originalMixin) { return true; }
      o = Object.getPrototypeOf(o); }
    return false; }
  return mixin;
};
// Writing Your Own Mixin Decorators - 2 main types of mixin decorators: wrap & patch
// 1.wrap : make sure you call `wrap` and usually you want to (conditionally) invoke the mixin function
```
import { wrap } from 'mixwith';
const DeDupe = (mixin) => wrap(mixin, (superclass) => {
  if (mixinAlreadyApplied(superclass)) { return superclass; } // non-invoked
  return mixin(superclass); // invoked
});
```
// 2.patch: patch & return `const Fooify = (mixin) => { mixin.foo = "Foo"; return mixin; };`

```

## Map()
all of the below _values_ could be derived from json/prop files, database queries, generated, etc.
then we would just come up with the logic to stitch it together (a.k.a `Map.set()`)
which would make _all_ `map.get()` calls **consistent** for every instance
- even if MMO: multiple players with a shared `Map()` object would _only_ have access to their information
  because **everything** stems from the logged in user's unique `id` _**OR**_ unique `userName`
```
const IN_GAME_OBJECTS = 'in game objects'
const userMap = new Map()
const userId = 987
const userName = 'mlnck'
const userData = {name:'a', email:'b' }

const characterMap = new Map()
const characterData = { _uid:1313, type: 'orc', health: 12 }

const consumables = {
  apple: 8,
  'poison worm': -13
}
const inventory = {
  bees: { atk:2, def: 43 },
  consumables,
  'fishing pole': { atk:10, def:0 },
  'frying pan': { atk:27, def:7 },
}
const majik = {
  'red spell': { cost: 123, type: 'void' },
  'blue potion': { trigger: 'INSTANT_DEATH' },
}
const items = {
  consumables,
  inventory,
  majik,
}

const characterObjects = {
  items,
  currency: [{gold:12}, {diamond: 32}],
  'this can be extended': ['etc', 'et cetera', '...'],
}
characterData[IN_GAME_OBJECTS] = characterObjects

// allows you to obtain `userData` with the user's unique id _**OR**_ unique username
// // EXTEND?! ~ use a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
// // // as the base. eg.
/*
  const _usr = Symbol(userId+userName)
  userMap.set(_usr, userId)
*/
// can always extend as well:
// The method `Symbol.for(tokenString)` takes a string key and returns a symbol value from the registry,
//   while `Symbol.keyFor(symbolValue)` takes a symbol value and returns the string key corresponding to it.
//   Each is the other's inverse, so the following is true:
// `Symbol.keyFor(Symbol.for("tokenString")) === "tokenString" // true`
// `const sym = Symbol('optional-description')` ... > `sym.description`

userMap.set(userId, userData)
userMap.set(userName, userData)

characterMap.set(userData, characterData)
characterMap.set(characterData['_uid'], { IN_GAME_OBJECTS: characterObjects })

//////////
userMap.get(userId)
userMap.get('mlnck')
characterMap.get(userMap.get(userName))
// > {_uid: 1313, type: 'orc', health: 12, in game objects: {…}}
characterMap.get(characterMap.get(userMap.get(userName))['_uid']).IN_GAME_OBJECTS
// > {items: {…}, currency: Array(2), this can be extended: Array(3)}
/**  ****  **/
/* then to enemies, npc, social, generators, etc* /
```
## collisions
```
// I like this implementation:
// Rect collision tests the edges of each rect to
// test whether the objects are overlapping the other
CollisionDetector.prototype.collideRect =
  function(collider, collidee) {
// Store the collider and collidee edges
  var l1 = collider.getLeft(); var t1 = collider.getTop();
  var r1 = collider.getRight(); var b1 = collider.getBottom();
  var l2 = collidee.getLeft(); var t2 = collidee.getTop();
  var r2 = collidee.getRight(); var b2 = collidee.getBottom();
// Test edges to prove no collision
  if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) { return false; }
  return true; // If the algorithm made it here, it had to collide
};
```
### Recommended styles to prevent selection
```
image, canvas {
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
}
```
### Canceling drag and selection events
```
canvasElement.ondragstart = function(e) { // do nothing in the event handler except canceling the event
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false; }
canvasElement.onselectstart = function(e) { // do nothing in the event handler except canceling the event
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false; }
```
### `isPointInPath` hit detection
```
$(canvas).on('handleClick', function(e, mouse) {

    // first, define polygonal bounding area as a path
    context.save();
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(0,100);
    context.lineTo(100,100);
    context.closePath();

    // do not actually fill() or stroke() the path because
    // the path only exists for purposes of hit testing
    // context.fill();

    // perform hit test between irregular bounding area
    // and mouse coordinates
    if (context.isPointInPath(mouse.x, mouse.y)) {
        // hit test succeeded, handle the click event!

    }
    context.restore();
});
```
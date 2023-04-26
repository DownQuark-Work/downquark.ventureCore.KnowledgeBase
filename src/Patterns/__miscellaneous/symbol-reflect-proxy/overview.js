/// SYMBOLS, REFLECT, PROXY
/*
- Symbols are all about Reflection within implementation - you sprinkle them on your existing classes and objects to change the behaviour.
- Reflect is all about Reflection through introspection - used to discover very low level information about your code.
- Proxy is all about Reflection through intercession - wrapping objects and intercepting their behaviours through traps.
*/

///////////// SYMBOL ///////////// 
/* In reality, Symbols are just a slightly different way to attach properties to an Object */
//>>> Okay, but what are Symbols really good for?

// Ensure unique value
log.levels = { DEBUG: Symbol('debug'),
                INFO: Symbol('info'),
                WARN: Symbol('warn'), };
log(log.levels.DEBUG, 'debug message');
log(log.levels.INFO, 'info message');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Store metadata values in an Object
var size = Symbol('size');
class Collection {
    constructor() { this[size] = 0; }
    add(item) { this[this[size]] = item; this[size]++; }
    static sizeOf(instance) { return instance[size]; }
}
var x = new Collection(); assert(Collection.sizeOf(x) === 0);
x.add('foo'); assert(Collection.sizeOf(x) === 1);

//
//
//

///////////// REFLECT ///////////// 
/*
Reflect is effectively a collection of all of those "internal methods"
  that were available exclusively through the JavaScript engine internals,
  now exposed in one single, handy object
*/

///// Reflect.apply ( target, thisArgument [, argumentsList] )
var ages = [11, 33, 12, 54, 18, 96];

//>>> clever usage of apply allows you to avoid looping over the array values
// Original Looping solution:
for (let i = 0; i < numbers.length; i++) // replaces the loop equivalent:
{ max = Math.max(max,numbers[i]); min = Math.min(min,numbers[i]); }

// Replace Function.prototype style:
var youngest = Math.min.apply(Math, ages);
var oldest = Math.max.apply(Math, ages);
var type = Object.prototype.toString.call(youngest);

// With Reflect style:
var youngest = Reflect.apply(Math.min, Math, ages);
var oldest = Reflect.apply(Math.max, Math, ages);
var type = Reflect.apply(Object.prototype.toString, youngest);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

///// Reflect.construct ( target, argumentsList [, constructorToCreateThis] )
//>>> call a Constructor with a set of arguments
class Greeting {
  constructor(name) { this.name = name; }
  greet() {return `Hello ${this.name}`;}
}

// Replace ES5 style factory:
function greetingFactory(name) {
  var instance = Object.create(Greeting.prototype);
  Greeting.call(instance, name);
  return instance;
}

// With ES6 style factory
function greetingFactory(name) { return Reflect.construct(Greeting, [name], Greeting); }
// Or, omit the third argument, and it will default to the first argument.
function greetingFactory(name) { return Reflect.construct(Greeting, [name]); }
// Super slick ES6 one liner factory function!
const greetingFactory = (name) => Reflect.construct(Greeting, [name]);

//>>> the 3rd param basically extends a class a runtime (without actually extending the class)
class Greeting {
  constructor(name) {this.name = name;}
  greet() {return `Hello ${this.name}`;}
}
class Example { constructor(name) {this.name = "Monster " + name; } }
const greetFactory = (name) => Reflect.construct(Example, [name], Greeting);
  var sayHello = greetFactory('Mike');
  sayHello.greet(); //will print 'Hello Monster Mike'

//
//
//

///////////// PROXY ///////////// 
/*
A global constructor which returns a new Object consisting of:
  the supplied Object param wrapped with the supplied hooks (handler) param
*/
///// Proxy(target, handler)
//>>> simple construction
var myObject = {};
var proxiedMyObject = new Proxy(myObject, {/*handler hooks*/});
/* different objects */  assert(myObject !== proxiedMyObject);
myObject.foo = true; assert(proxiedMyObject.foo === true);
proxiedMyObject.bar = true; assert(myObject.bar === true);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

///// track object on change
new Proxy({}, {
  set: (target,prop,val) => {
    if(tar[prop] !== val){ console.log(`prev value ${target[prop]}: new value ${val}`) }
    tar[prop] = val
}})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

///// make an infinitely chainable API
function urlBuilder(domain) {
  var parts = [];
  var proxy = new Proxy(function () {
      var returnValue = domain + '/' + parts.join('/');
      parts = []; return returnValue;
    }, {
      has: function () { return true; },
      get: function (object, prop) { parts.push(prop); return proxy; },
    });
  return proxy;}
var google = urlBuilder('http://google.com');
assert(google.search.products.bacon.and.eggs() === 'http://google.com/search/products/bacon/and/eggs')

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

///// handle DNE methods and/or values
function RecordFinder(options) {
  this.attributes = options.attributes; this.table = options.table;
  return new Proxy({}, function findProxy(methodName) {
    var match = methodName.match(new RegExp('findBy((?:And)' + this.attributes.join('|') + ')'));
    if (!match){ throw new Error('TypeError: ' + methodName + ' is not a function'); }
})};
function Foo() {
  return new Proxy(this, {
    get: function (object, property) {
      if (Reflect.has(object, property)) { return Reflect.get(object, property); }
      else { return function methodMissing() { console.log('you called ' + property + ' but it doesn\'t exist!'); } }
}})}
Foo.prototype.bar = function () { console.log('you called bar. Good job!'); }
foo = new Foo();
foo.bar(); //=> you called bar. Good job!
foo.this_method_does_not_exist() //=> you called this_method_does_not_exist but it doesn't exist

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

///// move function parameters into the function name for a more readable syntax
const baseConvertor = new Proxy({}, {
  get: function baseConvert(object, methodName) {
    var methodParts = methodName.match(/base(\d+)toBase(\d+)/);
    var fromBase = methodParts && methodParts[1]; var toBase = methodParts && methodParts[2];
    if (!methodParts || fromBase > 36 || toBase > 36 || fromBase < 2 || toBase < 2) {
      throw new Error('TypeError: baseConvertor' + methodName + ' is not a function'); }
    return function (fromString) { return parseInt(fromString, fromBase).toString(toBase); }
  }
});
assert(baseConvertor.base16toBase2('deadbeef') === '11011110101011011011111011101111');
assert(baseConvertor.base2toBase16('11011110101011011011111011101111') === 'deadbeef');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

///// hide all properties from all enumeration methods
//>>> make every property in an object completely hidden, except for when getting the value
var example = new Proxy({ foo: 1, bar: 2 }, {
  has: function () { return false; },
  ownKeys: function () { return []; },
  getOwnPropertyDescriptor: function () { return false; },
});
assert(example.foo === 1); assert(example.bar === 2);
assert('foo' in example === false); assert('bar' in example === false);
assert(example.hasOwnProperty('foo') === false); assert(example.hasOwnProperty('bar') === false);
assert.deepEqual(Object.keys(example), [ ]); assert.deepEqual(Object.getOwnPropertyNames(example), [ ]);
# Map()
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
# Database Queries
## CLI
> From here on out I'm not going to dupe the effort for the GUI
>  Probably won't preface the query template literal either
---
### `getExtra()`
> Appending `getExtra()` returns stats
```
query = `FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    LET sumOfAges = user1.age + user2.age
    FILTER sumOfAges < 100
    RETURN {
        pair: [user1.name, user2.name],
        sumOfAges: sumOfAges
    }`
db._createStatement({ query }).execute().getExtra()
```

### `getExtra()` & PROFILE
```
query = `FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    LET sumOfAges = user1.age + user2.age
    FILTER sumOfAges < 100
    RETURN {
        pair: [user1.name, user2.name],
        sumOfAges: sumOfAges
    }`
db._createStatement({ query, options: {profile: true}}).execute().getExtra()
```
---
### QUERY VALIDATION
> The _parse method of the db object can be used to parse and validate a query syntactically, without actually executing it.
`db._parse( "FOR i IN [ 1, 2 ] RETURN i" )`

### QUERY EXPLANATION
> Explain what happens
`db._createStatement("FOR i IN test FILTER i.value > 97 SORT i.value RETURN i.value").explain();`

### COLLECT
> individual examples separated by comments
```
// FOR u IN users RETURN u
// FOR u IN users COLLECT age = u.age RETURN age
// FOR u IN users RETURN DISTINCT u.age // COLLECT also sorts the results
// FOR u IN users COLLECT status = u.name, age = u.age RETURN { status, age }
/*
FOR u IN users
    COLLECT age = u.age INTO usersByAge
    SORT age ASC LIMIT 0, 5
    RETURN {age,users: usersByAge[*].u.name}*/
/*
FOR u IN users
    COLLECT ageGroup = FLOOR(u.age / 5) * 5,
            gender = u.gender INTO group
    SORT ageGroup DESC
    RETURN { ageGroup, gender } // RETURN { ageGroup, gender, group } // FOR DEBUG */
/*
FOR u IN users
    COLLECT ageGroup = FLOOR(u.age / 5) * 5,
            gender = u.gender WITH COUNT INTO numUsers
    SORT ageGroup DESC
    RETURN { ageGroup, gender, numUsers } */
/*
FOR u IN users
    COLLECT ageGroup = FLOOR(u.age / 5) * 5,
            gender = u.gender
        AGGREGATE // AGGREGATE clause in the COLLECT
            numUsers = LENGTH(1), // returns the length of an array
            minAge = MIN(u.age), maxAge = MAX(u.age)
        // MAX, MIN, SUM and AVERAGE, VARIANCE_POPULATION, VARIANCE_SAMPLE, STDDEV_POPULATION, STDDEV_SAMPLE, UNIQUE, SORTED_UNIQUE and COUNT_UNIQUE as basic aggregation functions.
    SORT ageGroup DESC
    RETURN { ageGroup, gender, numUsers, minAge, maxAge } */
```


---
### SUBQUERIES
#### UNWINDING
```
RETURN ( RETURN 1 ) // [ [ 1 ] ]
RETURN FIRST( RETURN 1 ) // [ 1 ]

```
#### WITH COLLECT
```
query = `FOR p IN persons
  COLLECT city = p.city INTO g // --> g maintains the FULL record
  RETURN {
    city : city, // this returns the `persons` original city
    numPersons : LENGTH(g), // this returns the amount of the aggregate
    maxRating: MAX( // subquery start
      FOR r IN g
      RETURN r.p.rating
    ) // subquery end
  }`
```
---
### ZIP
> Sets Key Value Pair
#### DYNAMIC ATTRIBUTE NAMES
```
LET documents = [
  { "name": "thisIS"," gender": "f", "status": "active", "type": "user" },
  { "name": "docDOTname", "gender": "m", "status": "inactive", "type": "unknown", "magicFlag": 23 }
]

FOR doc IN documents
  LET attributes = ( // subquery
    FOR attr IN ATTRIBUTES(doc) // attr = Object.key
      FILTER LIKE(attr, '%a%') // attr must include an 'a'
      RETURN {
        name: CONCAT(doc.name, '-', attr), // append Object.key to the original Object['name']
        value: doc[attr] // return original value - Object[Object.key]
      }
  )
  RETURN ZIP(attributes[*].name, attributes[*].value) // ZIP(key,value) => {key: value}
```
---
### [JOINS](https://www.arangodb.com/docs/stable/aql/examples-join.html)
> Too many great examples with documentation to bypass the link
#### ONE TO MANY
```
// THESE WOULD EACH BE IN A SEPARTE DB
LET citydocument = [{ 
  "_id" : "cities/2241300989", "_rev" : "2241300989",  "_key" : "2241300989",
  "name" : "Metropolis", 
  "population" : 1000, 
}]

LET usersdocument = [{ 
  "_id" : "users/2290649597", "_rev" : "2290649597", "_key" : "2290649597",
  "name" : { 
    "first" : "John", 
    "last" : "Doe" 
  }, 
  "city" : "cities/2241300989", 
}]
// END THESE WOULD EACH BE IN A SEPARTE DB

FOR u in usersdocument
    FOR c in citydocument
        FILTER u.city == c._id
        // RETURN { user: u, city: c } // creates redundant `city` key
        RETURN merge(u, {city: c}) // replaces redundant key with fulfilled object
```
#### MANY TO MANY
```
// THESE WOULD EACH BE IN A SEPARTE DB
// db._create("authors")
LET authorsdocument = [
    { "_id" : "authors/2935261693", "_rev" : "2935261693",  "_key" : "2935261693",
        name: { first: "John", last: "Doe" } },
    { "_id" : "authors/2938210813", "_rev" : "2938210813",  "_key" : "2938210813",
        name: { first: "Maxima", last: "Musterfrau" } },
]
// db._create("books")
LET booksdocument = [  // notice NO author information
    { "_id" : "books/2980088317", "_rev" : "2980088317",  "_key" : "2980088317",
        title: "The beauty of JOINS" },
]

/* This would be an EDGE collection :: `db._createEdgeCollection('written')`
- and the author's contributions
db.written.save("authors/2935261693", "books/2980088317", { pages: "1-10" })
db.written.save("authors/2938210813", "books/2980088317", { pages: "11-20" })
*/
LET writtenedgecollection = [ 
  { "_id" : "written/3006237181","_rev" : "3006237181","_key" : "3006237181",
    "_from" : "authors/2935261693", "_to" : "books/2980088317",
    "pages": "1-10" },
  { "_id" : "written/3012856317","_rev" : "3012856317","_key" : "3012856317",
    "_from" : "authors/2938210813", "_to" : "books/2980088317",
    "pages": "11-20" },
]
// END THESE WOULD EACH BE IN A SEPARTE DB

// GRAPH TRAVERSAL
// - To get the book and its authors
FOR b IN booksdocument
    LET authors = ( // subquery
        FOR author, contribution IN INBOUND b writtenedgecollection // filters edge collection to relevant authors per book
        RETURN { author, contribution }
    )
    RETURN MERGE(b, {authors})
// - To get teh author and their books - replace INBOUND with OUTBOUND
FOR a IN authors " +
    LET booksByAuthor = (
        FOR b IN OUTBOUND a written
            OPTIONS { order: 'bfs', uniqueVertices: 'global' } // bfs && global means all vertices will be checked
        RETURN b
    )
    RETURN MERGE(a, {books: booksByAuthor})
```
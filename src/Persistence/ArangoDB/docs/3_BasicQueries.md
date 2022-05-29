# Database Queries
## GUI
> via the [GUI](http://localhost:8529/_db/_system/_admin/aardvark/index.html#queries)

### GET DOCUMENT
`RETURN DOCUMENT('<COLLECTION_NAME>/<COLLECTION_KEY>')`
- e.g.: `RETURN DOCUMENT('users/2257')`

### ADD NEW DOCUMENT
`INSERT { name: "Katie Foster", age: 27 } INTO users`

### ADD AND RECEIVE INSERTED
```
INSERT { name: "James Hendrix", age: 69 } INTO users
RETURN NEW
```

### QUERY ALL
```
RETURN DOCUMENT( ["users/XXX", "users/YYYY", "users/ZZZZ"] )

# OR #

FOR user IN users
  RETURN user
```

### QUERY ALL WITH SORT
```
FOR user IN users
  SORT user.age DESC
  RETURN user
```

### QUERY ALL WITH SORT AND FILTER
```
FOR user IN users
  FILTER user.age > 30
  SORT user.age
  RETURN user
```

### UPDATE (PATCH) AND RECEIVE RESULT
> NOTE: If we used `REPLACE` instead, the name attribute would be gone. 
```
UPDATE "9915" WITH { age: 40 } IN users
RETURN NEW
```

### REMOVE
```
FOR user IN users
    FILTER user.age >= 130
    REMOVE user IN users
```

### RETURN PROJECTION
A projection seems to be just destructred data
- `FOR user IN users RETURN { userName: user.name, age: user.age }`

### CONCAT
- `FOR user IN users RETURN CONCAT(user.name, "'s age is ", user.age)`

### NESTED
```
FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    RETURN [user1.name, user2.name]
```

### USING `LET` TO PUT IT ALL TOGETHER
```
FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    LET sumOfAges = user1.age + user2.age
    FILTER sumOfAges < 100
    RETURN {
        pair: [user1.name, user2.name],
        sumOfAges: sumOfAges
    }
```


---


## CLI
> Decent documentation by running:
> - `arangosh> help()`
```
# :: SYNTAX ::
# ~~~~~~~~~~~~
// life will be easier by omitting the `const` declarations below:

const query = 'RETURN DOCUMENT("<COLLECTION_NAME>/<COLLECTION_KEY>")'
# e.g.: const query = 'RETURN DOCUMENT("users/2257")'

// either of the below would work
# const stmt = new ArangoStatement(db, { query })
const stmt = db._createStatement({ query })

# SET query OPTIONS
# set max. amt of results to be transferred per roundtrip
# // stmt.setBatchSize(<value>)
# return number of results in "count" attribute
# // stmt.setCount(<value>)

# GET query OPTIONS
# return the max. number of results to be transferred per roundtrip
# // stmt.getBatchSize()
# return count flag (return number of results in "count" attribute)
# // stmt.getCount()
# return query string results in "count" attribute)
# // stmt.getQuery()

# Bind parameters to a query:
# // stmt.bind(<key>, <value>)            bind single variable
# // stmt.bind(<values>)                  bind multiple variables
# Execute query:
# // cursor = stmt.execute()              returns a culrsor
# Get all results in an array:
# // docs = cursor.toArray()
# Or loop over the result set:
# // while (cursor.hasNext()) { print(cursor.next()) }
# ALSO:
# cursor._help()
# OR AUTOFILL HELP:
# cursor. <tab-tab>
```

### GET DOCUMENT
```
 stmt = db._createStatement({ "query": "RETURN DOCUMENT('users/2257')" })
 cursor = stmt.execute()
 documents = cursor.toArray()
 cursor = stmt.execute()
 while (cursor.hasNext()) { print(cursor.next())  }
 ```

### ADD NEW DOCUMENT
```
query = 'INSERT { name: "Katie CLI Foster", age: 27 } INTO users'
db._createStatement({ query }).execute()
```

### ADD AND RECEIVE INSERTED
```
query = `INSERT { name: "Bobby Dylan", age: 73 } INTO users
        RETURN NEW`
db._createStatement({ query }).execute()
```

### QUERY ALL
```
query = `RETURN DOCUMENT( ["users/XXX", "users/YYYY", "users/ZZZZ"] )`

# OR #

query = `FOR user IN users
  RETURN user`
db._createStatement({ query }).execute()
```

### QUERY ALL WITH SORT
```
query = `FOR user IN users
  SORT user.age DESC
  RETURN user`
db._createStatement({ query }).execute()
```

### QUERY ALL WITH SORT AND FILTER
- Also return only the name
```
query = `FOR user IN users
  FILTER user.age > 30
  SORT user.age
  RETURN user.name`
db._createStatement({ query }).execute()
```

### UPDATE (PATCH) AND RECEIVE RESULT
> NOTE: If we used `REPLACE` instead, the name attribute would be gone. 
```
query = `UPDATE "9915" WITH { age: 420 } IN users
RETURN NEW`
db._createStatement({ query }).execute()
```

### REMOVE
```
query = `FOR user IN users
    FILTER user.age >= 130
    REMOVE user IN users`
db._createStatement({ query }).execute()
```

### RETURN PROJECTION
A projection seems to be just destructred data
```
query = `FOR user IN users
  RETURN { userName: user.name, age: user.age }`
db._createStatement({ query }).execute()
```

### CONCAT
```
query = `FOR user IN users RETURN CONCAT(user.name, "'s age is ", user.age)`
db._createStatement({ query }).execute()
```

### NESTED
```
query = `FOR user1 IN users
  FOR user2 IN users
    FILTER user1 != user2
    RETURN [user1.name, user2.name]`
db._createStatement({ query }).execute()
```

### USING `LET` TO PUT IT ALL TOGETHER
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
db._createStatement({ query }).execute()
```
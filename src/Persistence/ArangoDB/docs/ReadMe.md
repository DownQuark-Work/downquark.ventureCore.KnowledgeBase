# ArangoDB

## Installation
Installed via HomeBrew
- `$ brew install arangodb`

Secured with:
- `$ arango-secure-installation`
  - un: 'root'
  - pw: 'root'

---
### CLI Usage
> Shell 1
- launch daemon:
  - `$ arangod`
> Shell 2
- launch CLI shell with root user
  - `$ arangosh`
- create new database, user, and assign user to database
```
arangosh> db._createDatabase('qrxDb')
arangosh> var users = require('@arangodb/users')
arangosh> users.save('mlnck@dq.work', 'dq')
arangosh> users.grantDatabase('mlnck@dq.work', 'qrxDb')
```
> Shell 3
- login with new user
  - `$ arangosh --server.username "mlnck@dq.work" --server.database qrxDb`

---
### GUI
> Server instantiated with:
- `$ arangod`
  - Accessible via [localhost:8529](http://localhost:8529)

## Documentation
- ArangoDB
  - https://www.arangodb.com/docs/stable/index.html
- AQL
  - https://www.arangodb.com/docs/stable/aql/index.html

  ## Learn
  - https://www.arangodb.com/learn/
  - https://www.arangodb.com/docs/stable/tutorials.html
  - https://www.arangodb.com/docs/stable/aql/tutorial.html

  ### Data
  - https://github.com/arangodb/example-datasets
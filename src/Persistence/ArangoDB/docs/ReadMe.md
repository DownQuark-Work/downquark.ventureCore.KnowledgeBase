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
#### Full Connection Options:
> --server.database <string>
- name of the database to connect to
> --server.endpoint <string>
- endpoint to connect to
> --server.username <string>
- database username
> --server.password <string>
- password to use when connecting
> --server.authentication <bool>
- whether or not to use authentication

> NOTE:
At signs @ in startup option arguments need to be escaped as @@. ArangoDB programs and tools support a special syntax @envvar@ that substitutes text wrapped in at signs with the value of an equally called environment variable. This is most likely an issue with passwords and the --server.password option.
>
> For example, password@test@123 needs to be passed as --server.password password@@test@@123 to work correctly, unless you want @test@ to be replaced by whatever the environment variable test is set to.
---
### GUI
> Server instantiated with:
- `$ arangod`
  - Accessible via [localhost:8529](http://localhost:8529)

## Documentation
## ArangoDB
  - https://www.arangodb.com/docs/stable/index.html
## AQL
  - https://www.arangodb.com/docs/stable/aql/index.html
## Foxx
  - https://www.arangodb.com/docs/stable/foxx-getting-started.html

## Learn
> See `../development/_tutorials/ReadMe.md`

  ### Data
  - https://github.com/arangodb/example-datasets

### Cmmunity
- https://www.arangodb.com/projects-and-integrations/
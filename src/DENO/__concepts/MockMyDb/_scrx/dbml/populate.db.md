# Database Population
Not sure how viable this will be - but it's the start of my ideas on what needs to happen for the database to be auto-filled in a way that retainis all of the bindings specified.
- Since the purpose is to get you up and running as fast as possible all actual logic as to _how_ the database is populated will be out of scope.
  - a.k.a. we are omitting the link of the chain which would rely on a `PROCEDURE`, or `pub/sub`/`bus`.
- this will allow for validation of the _final result_ while asserting the **minimal** amount of effort to acheiving it.


The following resources will be used to convert `DBML` into the **ERD** and **mySQL** output files.
- [DBML CLI](https://www.dbml.org/cli/) will create the `sql`
- [DBML Renderer](https://github.com/softwaretechnik-berlin/dbml-renderer) will create tehe images

_**NOTE:**_ Resources for the _Pseudo Data_ can be found at the end of the document

---
## _Recommendations & Nuances_
>
> For a more streamlined development process we recommend only creating one schema, and prefixing your table names within. This allows for greater encapsulation while still allowing for the full experience of creating separate databases for the production environment.

### _1. Templates_
We apply a simple template when naming our tables to assist in organization:
- By default the table naming template is defined as:
```
`primaryschema`.`[±SemanticCategory] DescriptiveType::OptionalTypeExtension`
```
- giving us a look along the lines of this:
```
`mockmydb`.`[+Content] Comment::Revisions`
```
- Similary, for _join tables_ we use:
```
`primaryschema`.`[±join] List:Of:Included:Tables`
```
 - which results in something similar to:
 ```
 `mockmydb`.`[+join] User:Friend:Type`
 ```

 - and lastly, aggregates:
 ```
 `primaryschema`.`[-aggregate] List:Of:Included:Tables`
 ```
 - could result in:
 ```
 `mockmydb`.`[-aggregate] Individual:Family`
 ```
 > note: the `±` character seen above would be replaced with a `+` or `-` sign.
 > - The `+` denotes the _WRITE_ database
 > - the `-` denotes the _READ_
 > - _AGGREGATE_ tables are **only** stored in the _READ_ database so will **always** contain the `-` symbol.

### _2. Functional Overrides_
 _**BE AWARE:**_
 
 Any _DBML defined_ tablename that starts with `[@` will _**NOT**_ be persisted to the database.

 Instead, we use these tables to transfer features and settings which are needed to:
 - Define the structural requirements to non-relational databases
 - Further customize rulesets to be used when determining and inserting _Pseudo Data_ into the database
- any other miscellaneous processes that may or may not be discovered
---
## DBML Defines _Pseudo_ Data
### The Good
In order to keep with the spirit of what _DBML_ was created for we have only a **single** file to define all _non-relational database_ logic (and extended _Pseudo Data_ rules).

This simplifies complexity by allowing you to define each customization in the table and/or field that it will be applied to.

### The Bad
 However, DBML was created to interact with the only the structure of a relational database (where it excels), never with the content (where it becomes severely restrictive). And _absolutely, definitely_ not with any _non-relational_ storage type.

We were further pigeon-holed due to the fact we did not want to edit third party code inside a project that is still making code enhancements of their own. Any chnages we made to their code would ensure it would only be a matter of time until there was a complete failure in ours.
 
### The ~~Ugly~~ Slightly Unatrractive
Our solution contains two aspects:
1. leveraging our table naming convention (see _Recommendations & Nuances_ above) we can create definitons/extensions for anything _outside_ of _relational database_ tables.
  - These high level changes tyically require more of an overhaul for development
  - Luckily, we can now make ephemeral tables to more than meet the challenge

2. Taking advantage of the (bound by default) `Note` option that _DBML_ has included on both the table and individual fields within.
  - Changes made at this level are usually _much_ less effort to resolve due to the fact _DBML_ has already put the struture in place for us.

> Note: this solution will remain in place for the _Proof Of Concept_ build. At which point we will reassess and implement a cleaner and more efficient workflow

> See additional, more complete, explanations and examples after the **Flow** section

---
## Define _Pseudo_ Data
Now that you know _why_ the adjustments need to be made where they need to be made, let's get into the _how_.

> **Remember**:
> This is _only_ required when wishing to override the default _Pseudo Data_, or wishing to create _non relational_ databases.

### _Granularity takes priority_
**1** - If an override is defined on the `Table @.Project`:
  - Override will affect _all_ applicable table and field instances
    - _**UNLESS**_
  - A separate override is applied on a `Table`.

**2** - If an override is defined on a `Table`:
  - Override will affect _all_ nested applicable field instances
    - _**UNLESS**_
  - A separate override is applied on a field.

---
### _Defaults_
What happens if you override nothing?
We will attempt to find the best fit for the field:

1. Atempt to find best fit
field type|insert value
:-|-:
`username varchar(18)`|random noun < 18 characters in length
`name varchar(12)`|first name < 12 chars
`first_name varchar(8)`|first name < 8 chars

2. `NULL`s
- If a field is not an index, key, reference, _AND_ `NOT NULL` is omitted _THEN_ there will be random _NULL_ (or void) values
- You can override the percent range

> TODO: finish defining _Defaults_

### Overrides
_**Reserved Tables**_
1. `Table "@".'[Project] Defaults'`
- use this to globally override the default values
  - see _Syntax_ below to override everything from the pseduo-values to the data-source where we obtain the pseudo-values

2. `Table @.[NonRelational-Database] Arango`
- only _Arango_ is currently supported for the database type
  - more are on the roadmap to be built out
- this can be _optionally extended_ to include a database name
  - allows for more than one database to be created. eg:
    -`Table @.[NonRelational-Database] Arango::data`
    -`Table @.[NonRelational-Database] Arango::base`
  - if no name supplied, schema name will default to `Arango`

3. `Table "@".'[Distributed-Databases] Content-Flow'`
- If sharing content between "databases", you _must_ use this table to specify the order of content injection and flow. (more details below)

_**Dynamic Tables**_
You can optionally specify overrides on `named tables` that can then be scoped when using the `Note` attribute within _DBML_
1. Define table (and include overrides)
  - `Table @.[Named-Overide] My-Named-Override-Table`
2. Apply override from `DBML`
```
Table mockmydb.[+Content] Comment::Revisions {
  Note {'''
    Real content for the database table can be included
    [@My-Named-Override-Table]
    More real content
  '''}
  ...
}
```
  - in the above example [@My-Named-Override-Table] tells the parser what table to reference when overriding the default values
    - This allows you to reuse the defaults defined in `[@My-Named-Override-Table]` on multiple _DBML_ tables you specify inline. Maintaining the non-confusion aspect we're focused on.

_**Inline _DBML_**_
Similar to above, we can also do the following:
```
Table mockmydb.[+Content] Comment::Revisions {
  Note {'''
    Real content for the database table can be included
    [@] my single table level override[@]
    More real content
    [@] 
      multiple table level overrides
      specified 1 per line
      still affect all nested fields
    [@]
  '''}
  name varchar(12) [not null, note: 'a real note [@]unless re-specified here[@]']
  age tinyint(2)[note:'
  [@]
  also with the ability
  to have multiple overrides
  [@]
  ']
  ...
}
```
---
### _Pseudo Data, Real Rules_
1. Syntax for defining the overrides go here
- `Table` syntax
- _**Inline**_ syntax
  - make sure to include
    - setting data source
    - hardcoding values
    - customizing the randomized/faker/etc values
    View the `markup` file for a better job explainging it.

### Related Databases
To support multiple database mocking we leverage the constraint mentioned before. When naming a table, the syntax recommendation (using a non alpha-numerical character as the first) is what is used to determine the database the entity belongs to:
- `[+Account]` vs `[-Account]` vs `[graph]`
  - `+` vs `-` vs _none_
  - _none_ will not be displayed and is found on the _Pseudo Data_ and _arangodb_ tables.
- You will have to decide which databases are your primary/write databases, and which ones will be inheriting the information from the primaries, and the order the databases will be populated (to simulate eventsourcing, or the Query Response split).

> IMPORTANT: You have to specify a point for us to start with the data mocking. You do this be adding a _note_ of `@initial` on either a field or a table in your _primary_ database.
> - Typically a good place to place it would be on the `users` table (or equivalent with your project)

-  You can define everything on `Table "@".'[Distributed-Databases] Content-Flow` - there will ony be a single place to define all mappings nad updates for the database flow. And that is this table. Enjoy!
Which I'm prety sure is easier to display than explain.

> Use something along the lines of mermaid's flowchart syntax to show the connections between the database tables and how they map to the graph db

> Note: to keep consitency with what would be expected - we ignore any databe "@" rules on all tables/fields/etc that are being populated by values from other databases.

# _CONGRATS_
We are now ready to take over!
Your thinking is complete!

Chances are the sql file contains _many_ broken pieces of the puzzle. But that didn't matter. All that mattered was finding a way to pass on configuration data that was never supposed to be compiled in the first place. And you accomplished taht - go grab a juice box - I'm starting my work!

A full listing of my changes are below for now, probably until I no longer need them.

---
## Flow
1. Complete `DBML`
1. Apply all content required for `Psuedo Data` and _non-relational_ database overrides
1. Define Primary -> Secondary -> etc database population
1. Export `DBML` -> `MySQL`
  - the `MySQL` will more than likely be broken
  - but all content that we shouldn't have been able to obtain, is now in our hands
1. Magic

**Create Primary DB Structure**
1. Create clone of `.sql` file
1. Remove everything except the creation of the primary db
  - should be able to find everything with `@`
    - delete all references found
      - execpt `@initial` (although you could rednew the not if wankte
1. run what is left on that script and the _primarydb_ should be built.
1. > We need to populate the info now
1. focus on the `@initial` table
1. translate what is written into an INSERT statemnt to add 1 record to the field
  - make sure to reference the `faker` files for values
- apply the INSERT
  - start again with more random `faker`'s
  - use whatever the user has entered or the default of 5-27 rows (or whatever)
1. **IMPORTANT**: before you can repeat for the next table
  - find and follow any indexes/keys/refernces
  - create INSERT statements that from current table into their respective relations with identical values
1. Run the INSERT
  - It is important to do this before moving to the next table so that the generated INSERT from the next table knows what not to overwrite
1. continue to another table (priority is kind of pointeless after the inital start location)
  - Repeat the above process
    - DO NOT overwrite any pre-existing values as they have been placed via a reference
  - Repeat until the primary db is populated.

> use `Table "@"."[Distributed-Databases] Content-Flow"` to begin the first migration.
1. Structure first
  - like the db just completed,
    adjust the search params, but create the db with an empty structure to verify we are correct with our insert statements
1. 
>> FINISH THIS THOUGHT

Then same with graphdb
>> FINISH THIS THOUGHT

Then we can get back to actually writing code!!!

### Tauri
_**[Tauri_Deno_Starter](https://dev.to/tauri/use-deno-to-build-a-tauri-app-1f7h)**_
[Tauri_Deno_Starter](https://github.com/astrodon/astrodon)
- https://tauri.app/v1/guides/features/system-tray
- https://github.com/tauri-apps/tauri-plugin-sql
- https://tauri.app/v1/guides/features/command#complete-example

> -https://www.arangodb.com/docs/stable/programs-web-interface-graphs.html
> https://www.arangodb.com/docs/stable/aql/examples.html

- https://tauri.app/v1/guides/features/cli

### Arango
- https://www.arangodb.com/community-server/sql-aql-comparison/
- https://www.arangodb.com/tutorials/mongodb-to-arangodb-tutorial/
- https://github.com/arangodb/arangodb/blob/devel/js/common/modules/%40arangodb/graph-examples/example-graph.js
  - https://github.com/arangodb/arangodb/tree/devel/js/common/modules/%40arangodb
- https://university.arangodb.com/courses/graph-course-for-beginners/
---
## Resources
> featured:
> - https://driftdb.com/ <<<< Look into this for sure
>   - https://github.com/drifting-in-space
>   - https://github.com/drifting-in-space/driftdb
> > DriftDB has a very basic trust model: if you have the room ID, you have write access to all data in the room. This is useful for applications whose multiplayer functionality can be siloed into rooms, where access to each room can be limited to a set of people trusted by the room’s creator.
> >
> >If you want to run arbitrary server-side code for persistence or access control, consider using [Plane](https://plane.dev/) instead.
> - https://plane.dev
> > Plane lets you spin up instances of any HTTP-speaking container via an API. Plane assigns a unique subdomain to each instance, through which it proxies HTTPS/WebSocket connections. When all inbound connections to a container are dropped, Plane shuts it down
>
> Using [NATS](https://nats.io/) - open source message bus
> - https://docs.nats.io/running-a-nats-service/introduction
---
### https://cheats.rs/

> Mock
- https://generatedata.com/generator
- https://thestorystarter.com/
- https://pokeapi.co/docs/v2
- https://developer.marvel.com/docs
- https://www.mockaroo.com/
- https://github.com/mockoon/mockoon/tree/main/packages/cli#installation \(docker image may be the best bet - or npx depending on how [tauri](https://tauri.app/) works\)
- https://github.com/faker-js/faker
  - https://github.com/faker-js/faker/tree/next/src << src
  - https://fakerjs.dev/api/ << api
- https://ksgr.shinyapps.io/Study-Design-App/
- https://www.rdatagen.net/page/shiny/
- https://kgoldfeld.github.io/simstudy/index.html
- https://eliocamp.github.io/metamer/
> DB/Framework/CLI/etc
- https://stackoverflow.com/questions/49489771/mysql-concat-group-concat-left-outer-join?rq=1
- https://lib.rs/crates/aragog_cli
- https://lib.rs/crates/arangors
- https://lib.rs/crates/tardis
- https://docs.rs
- https://lib.rs/command-line-utilities
> datasets
- https://mockoon.com/mock-samples/amentumspace-gravity/
- https://search.gesis.org/research_data/SDN-10.7802-2516?doi=10.7802/2516 - twitter convo in 24 hrs

- https://github.com/arangodb/example-datasets
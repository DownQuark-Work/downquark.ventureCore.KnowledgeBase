# Graph Course
Quick Switch off of `_System` via:
- `db._useDatabase('qrxDb')`
  - Sanity check
- `db._name()`
---
## Dataset
1. By default the `root` user does NOT have access to new databases. Had to change persmissions from teh `Users` Page in the `_system` db.
1. Imported data with:
    1. `arangoimport --file /PATH/TO/airports.csv --type csv --collection airports --create-collection --server.database qrxDb`
    1. `arangoimport --file /PATH/TO/flights.csv --type csv --collection flights --create-collection --create-collection-type edge --server.database qrxDb`
---
## Basic Queries
> Initial sanity check query
```
query = `FOR airport IN airports FILTER airport.vip LIMIT 5 RETURN airport`
db._createStatement({ query }).execute()
query = `RETURN COUNT(airports)`
db._createStatement({ query }).execute()
```

> GEO_POINT
```
query = `FOR a IN airports LIMIT 500 RETURN GEO_POINT(a.long, a.lat)`
db._createStatement({ query }).execute()
```
- **NOTE:** Using CLI a list of points are returned. Using the GUI and a map is rendered with the points highlighted

> COLLECT (GROUP BY from mysql)
```
query = `FOR airport IN airports
  FILTER airport.vip
  COLLECT WITH COUNT INTO count RETURN count`
db._createStatement({ query }).execute()
```
---
## Knowledge Check #1
```
> query = `RETURN DOCUMENT('airports/LAX')`
> query = `FOR a IN airports FILTER a.city == 'Los Angeles' RETURN a`
> query = `FOR a IN airports FILTER a.state == 'ND' RETURN a.name`
> query = `FOR a IN airports FILTER a._key IN ['BIS', 'DEN', 'JFK'] RETURN {aeropuerto: a.name}`
> query = `FOR a IN airports
  FILTER !a.vip AND a.state == 'NY'
  COLLECT WITH COUNT INTO count RETURN count`
```
---
## Graph Query Syntax
```
FOR vertex[, edge[, path]]
  IN [min[..max]]
  OUTBOUND|INBOUND|ANY startVertex
  edgeCollection[, more...]
  [OPTIONS {
    bfs: true,
    uniqueEdges: 'none'|'path'
    uniqueVertices: 'none'|'path'|'global',
  }]
```
### Graph Query Syntax Explanation
`FOR` emits up to three variables
- `vertex` (object): the current vertex in a traversal
- `edge` (object, optional): the current edge in a traversal
- `path` (object, optional): representation of the current path with two members:
  - `vertices`: an array of all vertices on this path
  - `edges`: an array of all edges on this path
    - SEE: `Graph Query PATTERN_MATCH Explanation` Below
- `IN min..max`: defines the minimal and maximal depth for the traversal.
  - If not specified min defaults to 1 and `max` defaults to `min`
    - If min is set to `0` the traversal will include the start vertex
- `OUTBOUND/INBOUND/ANY` defines the direction of your search
- `edgeCollection`: one or more names of collections holding the edges that we want to consider in the traversal (anonymous graph)
---
### Graph Query Syntax OPTIONS Explanation
- `OPTIONS
  - `bfs: true` will enable a **breadth-first-serach**
    - **depth-first-serach** is _DEFAULT_
  - `uniqueEdges:`
    - `none` allows traversing to continue over edges already followed
      - could result in very long run times
    - `path` ensures edges are only traversed a single time
  - `uniqueVertices:`
    - `none` allows traversing to continue over vertices from any given path at any time regardless of it had previously been traversed or not
      - could result in very long run times
    - `path` ensures no duplicate vertices on each individual path
    - `global` ensures every reachable vertex to be visited once for the entire traversal.
      - requires `{bfs: true}` (breadth-first search)
        - Depth-first search results would be completely non-deterministic as there is no rule in which order the traverser follows the edges of a vertex.
        - Uniqueness rule would lead to randomly excluded paths whenever there are multiple paths to chose from.
---
### Graph Query PATTERN_MATCH Explanation
- Full paths can be optionally emitted as third variable:
  - `FOR vertex, edge, path IN ...`
- Allowing filters on intermediate or all vertices and/or edges on the path.
  - e.g. _What are the best connections between the airports A and B determined by the lowest total travel time?_
- Applies complex filter conditions in traversals taking the entire path into account
- Allows for the discovery of specific patterns (combinations of vertices and edges in graphs) and is therefore called _**pattern matching**_.
---

## Graph Queries
> Return the names of all airports one can reach directly (1 step) from Los Angeles International (LAX) following the flights edges:
```
> query = `FOR airport IN 1..1 OUTBOUND
    'airports/LAX' flights
    RETURN DISTINCT airport.name`
```
> Return any 10 flight documents with the flight departing at LAX and the destination airport documents like {"airport":{...},"flight":{...}}
>
> NOTE: below defaults to `IN 1..1`
```
query = `FOR airport, flight IN OUTBOUND
  'airports/LAX' flights
  LIMIT 10
  RETURN {airport, flight}`
```
> Return 10 flight numbers with the plane landing in Bismarck Municipal airport (BIS):
```
query = `FOR airport, flight IN INBOUND 'airports/BIS' flights
  LIMIT 10
  RETURN flight.FlightNum`
```
> Find all connections which depart from or land at BIS on January 5th and 7th and return the destination city and the arrival time in universal time (UTC):
```
query = `FOR airport, flight IN ANY 'airports/BIS' flights
    FILTER flight.Month == 1 AND flight.Day >= 5 AND flight.Day <= 7
    RETURN { city: airport.city, time: flight.ArrTimeUTC }`
```
---
## Knowledge Check #2
> Remember: Use the GUI for maps
```
> query = `FOR flight IN flights
    FILTER flight.TailNum == 'N238JB'
    RETURN flight`
> query = `FOR f IN flights
    FILTER f.FlightNum == 860
    AND f.Month == 1 AND f.Day == 5
    RETURN KEEP(f, '_from', '_to')`
# to find valid flight numbers
> query = `FOR flight IN flights
    FILTER flight._from IN ["airports/JFK","airports/PBI"]
    SORT flight._from DESC
    RETURN DISTINCT [flight.FlightNum, flight._from]`
# then made sure enoguh results would populate to validate what we're proving
# # 8 distinct results
> query = `FOR flight IN flights
    FILTER flight.FlightNum IN [655, 53, 1103,1821,1061, 1777]
    FILTER flight._from IN ["airports/JFK","airports/PBI"]
    RETURN DISTINCT [flight._from, flight._to]`
# # 95 non-distinct results
> query = `FOR flight IN flights
    FILTER flight.FlightNum IN [655, 53, 1103,1821,1061, 1777]
    FILTER flight._from IN ["airports/JFK","airports/PBI"]
    RETURN [flight._from, flight._to]`
# # Running the query in the loop gives the same amounts and valudes as the hard coded version
> query = `FOR orig IN airports
    FILTER orig._key IN ["JFK", "PBI"]
      FOR dest, flight IN OUTBOUND orig flights
          FILTER flight.FlightNum IN [655, 53, 1103,1821,1061, 1777]
      RETURN [dest.name, flight._from, flight._to, flight.FlightNum, flight.Day]`
  db._createStatement({ query, count:1 }).execute().count() # 95
```
---
## Traversal Options
> Return all airports directly reachable from LAX
```
> query = `FOR a IN OUTBOUND 'airports/LAX' flights
    OPTIONS {
      bfs: true,
      uniqueVertices: 'global'
    } RETURN a`
#   } RETURN DISTINCT a._key
# Remove the above comment to verify validity
# # Run the below query and notice the performance difference
# > query = `FOR airport IN OUTBOUND 'airports/LAX' flights
#    RETURN DISTINCT airport`
```
> 🤓: What happens is that RETURN DISTINCT de-duplicates airports only after the traversal has returned all vertices (huge intermediate result), whereas uniqueVertices: 'global' is a traversal option that instructs the traverser to ignore duplicates right away.
----
## Shortest Path
> A shortest path query finds a connection between two given vertices with the fewest amount of edges

> Find a shortest path between Bismarck Municipal airport and John F. Kennedy airport and return the airport names on the route:
```
# Define `BIS` as our start vertex and `JFK` as our target vertex
> query = `FOR v IN OUTBOUND SHORTEST_PATH 'airports/BIS' TO 'airports/JFK' flights RETURN v.name`
```
> Return the minimum number of flights from BIS to JFK
```
> query = `LET airports = ( FOR v IN OUTBOUND
SHORTEST_PATH 'airports/BIS' TO 'airports/JFK' flights RETURN v
)
RETURN LENGTH(airports) - 1`
# -1 to not count the end vertex as a step
# Cannot not apply filters using SHORTEST_PATH
# # Resort to pattern matching instead
```
---
## Pattern Matching


RETURN CONCAT_SEPARATOR('->', p.vertices[*]._key)


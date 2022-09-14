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
`db.users.all().toArray();` // from shell
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
> # query = `RETURN DOCUMENT('airports',['LAX','MCO'])`
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
- `startVertex`: the vertex key to begin tranversing on
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
###
> This is what I was missing when I first started. Start with something small before jumping into the planes. After it clicked, _SO_ many nicer things started happening.
```
# load this simple graph from arangosh
> var examples = require("@arangodb/graph-examples/example-graph.js");
> var g = examples.loadGraph("mps_graph");
> # sanity
> db.mps_verts.toArray();
> db.mps_edges.toArray();
# Go to the GUI and just play with the follwoing:
FOR vrtx, edg, pth
    IN 1..2 INBOUND 'mps_verts/C' mps_edges
    RETURN edg
    // RETURN {vrtx, edg} // swap which return is commented
    // RETURN {vrtx, edg, pth} // and compare their outputs
# back in arangosh Remove the collections when all finished
> examples.dropGraph("mps_graph");
```

## Graph Queries
> Return the names of all airports one can reach directly (1 step) from Los Angeles International (LAX) following the flights edges:

> Super simple way to validate the graph from the **GUI**
- `FOR f IN flights RETURN f`
> NOTE: It seems that the Graph will attempt to render when _only_ the edges are returned from the GUI. e.g:
```
FOR vrtx, edg, pth
    IN 1..2 INBOUND 'vrtxs/C' edgs
    RETURN edg
```

> Now back to the **CLI**
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
  db._createStatement({ query, count:true }).execute().count() # 95
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
## K SHORTEST PATHS
> Every such path will be returned as a JSON object with three components:
> - an array containing the vertices on the path
> - an array containing the edges on the path
> - the weight of the path, that is the sum of all edge weights
>   - If no weightAttribute is given, the weight of the path is just its length.
```
FOR v IN OUTBOUND
K_SHORTEST_PATHS 'airports/BIS' TO 'airports/JFK' flights 
LIMIT 0,4 
RETURN v
```
## K Path
> This type of query finds all paths between two given documents, startVertex and targetVertex in your graph. The paths are restricted by minimum and maximum length of the paths.
> Every such path will be returned as a JSON object with two components:
> - an array containing the vertices on the path
> - an array containing the edges on the path

```
# Using shortest path val for _min_ and _max_
> query = `FOR v IN 2..2 OUTBOUND K_PATHS 'airports/MIA' TO 'airports/JNU' flights RETURN DISTINCT CONCAT_SEPARATOR(' 🛬 ', v.vertices[*].name)`

# Using shortest path as _min_ and shortest path +1 for _max_
> query = `FOR v IN 2..3 OUTBOUND K_PATHS 'airports/MIA' TO 'airports/JNU' flights RETURN DISTINCT CONCAT_SEPARATOR(' 🛬 ', v.vertices[*].name)`
```
### Runtime Stats
- `SHORTEST_PATH` returned _1 element_ in **0.598 ms**
- `2..2 K_PATHS` returned the same _1 element_ in **12.003 ms**
  - It took _~20.0719063545 **TIMES**_ longer to run `K_PATHS`
- `2..3 K_PATHS` returned _34 elements_ in **150.103 s** (over 2 and a half _MINUTES_)
  - It took _~12,508.5833333333 **TIMES**_ longer to run the second query than `2..2 K_PATHS`
    - _**AND**_
  - It took _~251,008.3612040134 **TIMES**_ longer to run the second query than `SHORTEST_PATH`
---

## Pattern Matching
### Why not a Shortest Path Query?
> In a shortest path query, it is not possible to apply filters because of the algorithm used under the hood to efficiently determine one shortest path between two vertices. However, you can use a shortest path query to determine the minimal length for such a path.
>
> Traversing a graph to find paths fulfilling complex conditions is called pattern matching.

- _TLDR;_ take advantage of the third param when traversing the graph:
  - `FOR vrtx, edg, pth IN ANY ...`

### To solve:
> What are the best connections between the airports Bismarck Municipal (BIS) and John F. Kennedy International (JFK) determined by the lowest total travel time?

> Shortest path can be used to find the minimal traversal depth in a separate query.
```
RETURN LENGTH(
  FOR v IN OUTBOUND
  SHORTEST_PATH 'airports/BIS' TO 'airports/JFK' flights
  RETURN v // returns 3
)
```
shortest path minus the destination gives us our min/max (3-1 = 2)
```
FOR v, e, p IN 2 OUTBOUND 'airports/BIS' flights
  FILTER v._id == 'airports/JFK'
  FILTER p.edges[*].Month ALL == 1 // Limit to single date
  FILTER p.edges[*].Day ALL == 1 // New Year's Works
  LIMIT 5
  RETURN p // Results in 2 paths to reach the deestination
```
`Date_Diff()` to determine flight time
```
FOR v, e, p IN 2 OUTBOUND 'airports/BIS' flights
  FILTER v._id == 'airports/JFK'
  FILTER p.edges[*].Month ALL == 1
  FILTER p.edges[*].Day ALL == 1
  FILTER DATE_ADD(p.edges[0].ArrTimeUTC, 20, 'minutes') < p.edges[1].DepTimeUTC // Prevents total flight time from being negative by ensuring the connecting flight does not depart until you have boarded
  LET flightTime = DATE_DIFF(p.edges[0].DepTimeUTC, p.edges[1].ArrTimeUTC, 'i')
  SORT flightTime ASC
  LIMIT 5
  RETURN { flight: p, time: flightTime }
```
> Above completed in _**285.506 ms**_
- Click on COLLECTIONS in the ArangoDB WebUI
- Open the flights collection
- Click on the Indexes tab
- Click the green button in the action column to add a new index
- Set Type to Hash (or Persistent if RocksDB) Index
- Type _from,Month,Day into Fields
- Leave the index options Unique and Sparse unticked
- Click the green Create button
> The extra index allows the traverser to quickly lookup the outgoing edges of the departure airport (_from attribute) for a certain day (Month, Day attributes), which eliminates the need to fetch and filter out all edges with flights on different days. It reduces the number of edges that need checking with a cheap index lookup and saves quite some time.

> Re-run query: Completed in _**46.863 ms**_

### One more as Proof
```
FOR v, e, p IN 2 OUTBOUND 'airports/JFK' flights
  FILTER v._id == 'airports/LAX'
  FILTER p.edges[*].Month ALL == 1
  FILTER p.edges[*].Day ALL == 7
  FILTER DATE_ADD(p.edges[0].ArrTimeUTC, 20, 'minutes') < p.edges[1].DepTimeUTC // Prevents total flight time from being negative by ensuring the connecting flight does not depart until you have boarded
  LET flightTime = DATE_DIFF(p.edges[0].DepTimeUTC, p.edges[1].ArrTimeUTC, 'i')
  SORT flightTime ASC
  LIMIT 25
  RETURN DISTINCT { flight: p, time: flightTime }
```
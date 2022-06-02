# Databases, Collections and Documents
> Databases are sets of collections. Collections store records, which are referred to as documents. Collections are the equivalent of tables in RDBMS, and documents can be thought of as rows in a table.

## Documents
Documents are grouped into collections. A collection contains zero or more documents.
- ArangoDB is by default schema-less,
- ArangoDB supports optional [schema validation](https://www.arangodb.com/docs/stable/data-modeling-documents-schema-validation.html) for documents on collection level.

## Collections
There are two types of collections:
- Document collection (also refered to as vertex collections in the context of graphs) as well as edge collections. 
- Edge collections store documents as well, but they include two special attributes, _from and _to, which are used to create relations between documents.

Usually, two documents (vertices) stored in document collections are linked by a document (edge) stored in an edge collection. This is ArangoDB’s graph data model. It follows the mathematical concept of a directed, labeled graph, except that edges don’t just have labels, but are full-blown documents.

## Databases
- There can be multiple databases.
  - Different databases are usually used for multi tenant setups, as the data inside them (collections, documents etc.) is isolated from one another.
- Composed of
  - Collections
  - Views
    - Read-only array or collection of documents
    - Usually maps some implementation specific document transformation, (possibly identity), onto documents from zero or more collections.
### _\_system_ database (default)
- Cannot be removed
- Database users are managed in this database
  - credentials are valid for all databases of a server instance
# (G|T)UI Utils
The end result is that the content created within this directory will be moved to a higher level.
However, while in current development, for ease of locating and working with these files, they will remain alongside the current project.

## Arrays
End goal is to use a single level array and helpers that will allow ease of transversing, comparisons and mutations.
1. Will have pointers:
  - `X = COLUMN = 0`
  - `Y = ROW = 0`
  - `[X,Y] = ...`
1. As well as helpers:
  - `AREA`
    - full index specified dimensions
  - `PERIMETER`
    - single array with indexes of the boundaries
  - `CUR_INDEX`
    - any specified index
    - `ADJACENT`
      - for use with CUR\_INDEX, will contain the indexes of the neighboring areas
  - `SUB_AREA`
    - an array of self contained single level arrays that are a subset of the AREA array
      - will have it's own PERMITER value, but everything else should be pulled from the AREA array
1. And methods:
  - `getCoordFromIndex(indx:number)`
  - `getIndexFromCoord(coord:[X,Y])`
  - `move`,`goTo`
    - work along with `CUR_INDEX`
    - will automatically update `ADJACENT`
    - `move` will be by coordinates:
      - `move([-1,3])`, `move({ROW:-1,COLUMN:3})`
    - `goTo` will be by index:
      - `goTo(13)`, `goTo(42)`
      - `goTo(getIndexFromCoord([42,13]))`
1. ...etc

This will begin as a 2D array and then there will be a method created (`mutateDimensions` maybe :shrug:) that will make it easy to create/delete/upsert what is currently created.
@ECHO OFF

cargo build --release --target wasm32-unknown-unknown --all

CALL :Stage chapter-01-hellorust
CALL :Stage chapter-02-helloecs
CALL :Stage chapter-03-walkmap
CALL :Stage chapter-04-newmap
CALL :Stage chapter-05-fov
CALL :Stage chapter-06-monsters
CALL :Stage chapter-07-damage
CALL :Stage chapter-08-ui
CALL :Stage chapter-09-items
CALL :Stage chapter-10-ranged
CALL :Stage chapter-11-loadsave
CALL :Stage chapter-12-delvingdeeper
CALL :Stage chapter-13-difficulty
CALL :Stage chapter-14-gear
CALL :Stage chapter-16-nicewalls
CALL :Stage chapter-17-blood
CALL :Stage chapter-18-particles
CALL :Stage chapter-19-food
CALL :Stage chapter-20-magicmapping
CALL :Stage chapter-21-rexmenu
CALL :Stage chapter-22-simpletraps
CALL :Stage chapter-23-generic-map
CALL :Stage chapter-24-map-testing
CALL :Stage chapter-25-bsproom-dungeons
CALL :Stage chapter-26-bsp-interiors
CALL :Stage chapter-27-cellular-automata
CALL :Stage chapter-28-drunkards-walk
CALL :Stage chapter-29-mazes
CALL :Stage chapter-30-dla
CALL :Stage chapter-31-symmetry
CALL :Stage chapter-32-voronoi
CALL :Stage chapter-33-wfc
CALL :Stage chapter-34-vaults
CALL :Stage chapter-35-vaults2
CALL :Stage chapter-36-layers
CALL :Stage chapter-37-layers2
CALL :Stage chapter-38-rooms
CALL :Stage chapter-39-halls
CALL :Stage chapter-40-doors
CALL :Stage chapter-41-camera
CALL :Stage chapter-45-raws1
CALL :Stage chapter-46-raws2
CALL :Stage chapter-47-town1
CALL :Stage chapter-48-town2
CALL :Stage chapter-49-town3
CALL :Stage chapter-50-stats
CALL :Stage chapter-51-gear
CALL :Stage chapter-52-ui
CALL :Stage chapter-53-woods
CALL :Stage chapter-54-xp
CALL :Stage chapter-55-backtrack
CALL :Stage chapter-56-caverns
CALL :Stage chapter-57-ai
CALL :Stage chapter-57a-spatial
CALL :Stage chapter-58-itemstats
CALL :Stage chapter-59-caverns2
CALL :Stage chapter-60-caverns3
CALL :Stage chapter-61-townportal
CALL :Stage chapter-62-magicitems
CALL :Stage chapter-63-effects
CALL :Stage chapter-64-curses
CALL :Stage chapter-65-items
CALL :Stage chapter-66-spells
CALL :Stage chapter-67-dragon
CALL :Stage chapter-68-mushrooms
CALL :Stage chapter-69-mushrooms2
CALL :Stage chapter-70-missiles
CALL :Stage chapter-71-logging
CALL :Stage chapter-72-textlayers
CALL :Stage chapter-73-systems
CALL :Stage chapter-74-darkcity

REM Publish or perish
cd book\book\wasm
pscp -r * herbert@vps.bracketproductions.com:/var/www/bfnightly/rustbook/wasm
cd ..\..\..

EXIT /B 0

REM Usage: Stage Chapter
:Stage
cd %~1
cargo build --release --target wasm32-unknown-unknown
if %errorlevel% neq 0 exit /b %errorlevel%
wasm-bindgen ..\target\wasm32-unknown-unknown\release\%~1.wasm --out-dir ../book/book/wasm/%~1 --no-modules --no-typescript
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..
move .\book\book\wasm\%~1\%~1.js .\book\book\wasm\%~1\myblob.js
move .\book\book\wasm\%~1\%~1_bg.wasm ./book/book/wasm/%~1/myblob_bg.wasm
copy index.html .\book\book\wasm\%~1

# Qiuck Start
```
cd ./_TimeAndTides/Browser/Network \ # network must be run from that dir for relative pathing # `--location` maybe
&& deno run --allow-net --allow-read --allow-write app.ts
```

TODO: [INTEGRATE] _perlin noise_ generator deno run --allow-read --allow-net fileserver.ts "../../../../../Generation/Noise/perlin.html"


# Structure
## Top Level Folders Relate to Application Layers
- Application (Client side)
- Network (deno server)
- Persistence (dbs)
- Protocol (chain)
 
## Deno
- https://deno.land/manual@v1.18.1/examples/http_server
  - https://deno.land/manual@v1.18.1/examples/file_server
- https://deno.land/manual@v1.18.1/tools/bundler
- https://deno.land/manual@v1.18.1/typescript/configuration#targeting-deno-and-the-browser
- https://deno.land/manual@v1.18.1/getting_started/permissions
^--should be enough to get html running with the deno CLI scripts
v-- maybe this one too
https://deno.land/manual@v1.18.1/tools/compiler
  - https://doc.deno.land/deno/unstable/~/Deno.CompilerOptions

- https://deno.land/manual@v1.18.1/examples/subprocess
- https://deno.land/manual@v1.18.1/tools/formatter
- https://deno.land/manual@v1.18.1/runtime/web_platform_apis#other-apis

## Rogue
convert [this](http://bfnightly.bracketproductions.com/rustbook/chapter_0.html) to javascript

### [Room Generation](https://www.pinterest.com/pin/3870349670306539/) <-- _really_ cool

http://roguebasin.com/index.php/Articles << AMAZING resource
- http://roguebasin.com/index.php/Articles#AI
- http://roguebasin.com/index.php/Articles#Map
- http://roguebasin.com/index.php/Articles#Time_management <

- http://roguebasin.com/index.php/Alternatives_to_Permadeath
- http://roguebasin.com/index.php/Irregular_Shaped_Rooms
- http://www.gridsagegames.com/blog/2015/10/morgue-files/
- http://roguebasin.com/index.php/Implementing_interesting_townsfolk_AI
- http://roguebasin.com/index.php/Smart_searching_and_Modeling_the_player_with_a_%22heatmap%22

- http://roguebasin.com/index.php/Themes
  - http://roguebasin.com/index.php/Pirates *

- http://roguebasin.com/index.php/Finding_graphical_tiles

- https://www.gamedeveloper.com/design/how-to-make-a-roguelike << Another tut

see:
downquark.sandBox.Antiquarks_Comprehensive/web/Client/gaming/rogue/test.ts

http://roguebasin.com/index.php/Dijkstra_Maps_Visualized

CHARACTERS:
https://i.redd.it/5v1rtg5rtnsz.png

https://i.pinimg.com/originals/54/66/2e/54662eecd5b6f182d923f3ac2c9db719.jpg
https://www.deviantart.com/brainee1/art/Chart-of-the-72-Classes-195825849

https://www.reddit.com/r/PixelArt/comments/q2tal2/underwater_pirate_pixelart_card_game_concept/?utm_medium=android_app&utm_source=share

> DEPPRECATED
```
deno bundle -c ../../../Generation/deno.jsonc \
../../../Generation/_utils/corridor.ts \
_TimeAndTides/Browser/Application/scripts/_deno/generators/_utils/corridor.ts

deno bundle -c ../../../Generation/deno.jsonc \
../../../Generation/_utils/floodfill.ts \
_TimeAndTides/Browser/Application/scripts/_deno/generators/_utils/floodfill.ts

deno bundle -c ../../../Generation/deno.jsonc \
../../../Generation/CellularAutomata/cellular_automata.ts \
_TimeAndTides/Browser/Application/scripts/_deno/generators/cellular_automata.ts
```
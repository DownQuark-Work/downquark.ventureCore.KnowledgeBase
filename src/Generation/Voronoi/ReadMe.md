> ALSO: Delaunay triangulation
REFERENCE: `../../Rust/Gaming/RogueLike/docs/rustrogueliketutorial/chapter-75-darkplaza/src/map_builders/voronoi.rs`

--> http://www.raymondhill.net/voronoi/rhill-voronoi.html (tutorial)
      http://www.raymondhill.net/voronoi/rhill-voronoi-core.js
  https://github.com/gorhill/Javascript-Voronoi

https://github.com/paperjs
- http://paperjs.org/examples/voronoi/
  - also uses rhill: http://paperjs.org/assets/js/rhill-voronoi-core.js

http://experilous.com/1/blog/post/procedural-planet-generation
http://www-cs-students.stanford.edu/~amitp/game-programming/polygon-map-generation/

https://donjon.bin.sh/fantasy/town/
- https://cfbrasz.github.io/Voronoi.html
- https://roguelikedeveloper.blogspot.com/2007/07/wilderness-generation-using-voronoi.html




[http://entropicparticles.com/7-procedure-for-road-networks](http://entropicparticles.com/7-procedure-for-road-networks)
> 3. We randomly choose edges where to locate the cities (27 red dots in this example). We assign a population following Zipf's Law which is know to reproduce the population rank-distribution of almost every country (the size of the dots represents the population). We calculate the pair-wise distance matrix of the cities and use it for ranking of the priority for building a road: we use the Gravity Model of migration (population of first city times population of the second city over the square of the distance between them) which favors to connect cities that are close and cities that are big.
- [Gravity Model of Migration](https://en.wikipedia.org/wiki/Gravity_model_of_migration)
- [Zipfs Law](https://en.wikipedia.org/wiki/Zipf%27s_law)
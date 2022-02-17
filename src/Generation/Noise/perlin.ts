'use strict'
// https://joeiddon.github.io/projects/javascript/perlin.html
// https://github.com/joeiddon/perlin/blob/master/demo.html
// - https://fietkau.plus/#perlin_terrain
const perlin = {
    rand_vect: function(){
        const theta = Math.random() * 2 * Math.PI
        return {x: Math.cos(theta), y: Math.sin(theta)}
    },
    dot_prod_grid: function(x:number, y:number, vx:number, vy:number):number{
        let g_vect: {x:number, y:number}
        const d_vect = {x: x - vx, y: y - vy}
        if (this.gradients[`${[vx,vy]}`]){
            g_vect = this.gradients[`${[vx,vy]}`]
        } else {
            g_vect = this.rand_vect()
            this.gradients[`${[vx, vy]}`] = g_vect
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y
    },
    smootherstep: function(x:number){
        return 6*x**5 - 15*x**4 + 10*x**3
    },
    interp: function(x:number, a:number, b:number):number{
        return a + this.smootherstep(x) * (b-a)
    },
    seed: function(){
        this.gradients = {}
        this.memory = {}
    },
    gradients: {} as {[k:string] : {x:number, y:number}},
    memory: {} as {[k:string] : number},
    get: function(x:number, y:number):number {
        // deno-lint-ignore no-prototype-builtins
        if (this.memory.hasOwnProperty(`${[x,y]}`))
            return this.memory[`${[x,y]}`]
        const xf = Math.floor(x)
        const yf = Math.floor(y)
        //interpolate
        const tl = this.dot_prod_grid(x, y, xf,   yf)
        const tr = this.dot_prod_grid(x, y, xf+1, yf)
        const bl = this.dot_prod_grid(x, y, xf,   yf+1)
        const br = this.dot_prod_grid(x, y, xf+1, yf+1)
        const xt = this.interp(x-xf, tl, tr)
        const xb = this.interp(x-xf, bl, br)
        const v = this.interp(y-yf, xt, xb)
        this.memory[`${[x,y]}`] = v
        return v
    }
}
perlin.seed()
perlin.get(3.9375,3.9921875)
parseInt((perlin.get(3.9375,3.9921875)*250).toString())
// for(let r=0; r<10; r+=4){
//   for(let c=0; c<10; c+=4){ perlin.get(c,r) }
// }
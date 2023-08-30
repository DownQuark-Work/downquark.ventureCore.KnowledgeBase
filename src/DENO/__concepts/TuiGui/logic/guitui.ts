// tmp: deno run --allow-read --allow-write --allow-run guitui.ts
// deno run --allow-read --allow-write --allow-run guitui.ts file-from-gui.toml [--]

import { GRID_DIRECTIONS, UtilsGrid } from "./_utils/grid.ts"
const { Grid } = UtilsGrid

// Grid.Create.Config({FILL_CHARACTER:null})
Grid.Create.Initial(42,13)
// console.log('UtilsGrid.: ', Grid.Create.Initial(42,13))
// console.log('Grid: ', Grid.Get.Position())
// console.log('Grid: ', Grid.Set.Position([13,10]))
// console.log('Grid: ', Grid.Set.Position(69))
// console.log('Grid: ', Grid.Set.Position(85))
// console.log('Grid: ', Grid.Set.Position(GRID_DIRECTIONS.SE,2))
// console.log('Grid: ', Grid.Set.Position(GRID_DIRECTIONS.S))
// console.log('Grid: ', Grid.Get.Position())
// console.log('Grid.Create.SubGrid: ', Grid.Create.SubGrid(69,85))
// console.log('Grid.Create.SubGrid: ', Grid.Create.SubGrid([3,3],[5,5]))
// console.log('Grid.Create.SubGrid: ', Grid.Create.SubGrid([10,10],[13,12]))
// console.log('Grid.Create.SubGrid: ', Grid.Create.SubGrid({X:13,Y:4},{X:18,Y:9}))
// console.log('Grid.Create.SubGrid: ', Grid.Create.SubGrid(181,396))

// console.log('Grid Cells: ', Grid.Get.Cells())
// console.log('Grid Perimeter: ', Grid.Get.Perimiter())

// const subGridToSet = Grid.Create.SubGrid([10,10],[13,12])
// console.log('subGridToSet: ', subGridToSet)

// Grid.Set.Cells({location:[6,9],value:['aBc',[1,2,3]]})
// Grid.Set.Cells({location:[[3,3]],value:'xyz'})
// Grid.Set.Cells({location:[[3,3],[4,3],[1,1]],value:[' 1  ',' 1  ',' 1  ']})
// Grid.Set.Cells({location:[{X:3,Y:3},{X:2,Y:3},{X:1,Y:1}],value:['  1 ',' 2  ',' 3  ']})
// console.log('Grid.Render(): ', Grid.Render())

// Grid.Set.Cells({location:[{X:11,Y:8}], value:' x '})
// Grid.Set.Cells({location:[{X:3,Y:3}],value:'abc'})
console.log('Grid.Render(): ', Grid.Render())
//
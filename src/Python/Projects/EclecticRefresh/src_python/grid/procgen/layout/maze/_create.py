from src_python.grid.utils.const import ENUM_MAZE_TYPE
from src_python.grid.procgen.layout.maze.GrowingTree import MazeGrowingTree


def main_maze(opts):
    # print('main maze with options: ', opts)
    maze_types = {
        ENUM_MAZE_TYPE.get('GROWING_TREE').get('type'): lambda opts_gt: MazeGrowingTree(opts_gt)
    }
    maze_types[opts.get('type')](opts)

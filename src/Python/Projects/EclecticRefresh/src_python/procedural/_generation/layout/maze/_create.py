from src_python.procedural.utils.const import ENUM_MAZE_ALGORITHM
from src_python.procedural._generation.layout.maze.GrowingTree import MazeGrowingTree


def main_maze(opts):
    # print('main maze with options: ', opts)
    maze_types = {
        ENUM_MAZE_ALGORITHM.get('GROWING_TREE').get('type'): lambda opts_gt: MazeGrowingTree(opts_gt)
    }
    maze_types[opts.get('type')](opts)

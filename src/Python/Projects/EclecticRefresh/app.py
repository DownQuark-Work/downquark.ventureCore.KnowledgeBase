import argparse
from datetime import datetime

import src_python.grid.utils.const

from src_python.grid import Main


# Argument parser
def build_arg_parser():
    # args are `width` `height` `seed`
    parser = argparse.ArgumentParser(description='width and height of the grid')
    parser.add_argument('dimensions', metavar='D', type=int, nargs='*',
                        default=[8, 17],
                        help='2 integers for the width and height of the grid')
    parser.add_argument('seed', type=int, nargs='*',
                        default=-1,
                        help='integer to seed the prng value')
    return parser.parse_args()


# only runs on init load
if __name__ == '__main__':
    args = build_arg_parser()

grid_h = args.__getattribute__('dimensions')[0]
grid_w = args.__getattribute__('dimensions')[1]

if grid_h % 2 == 0:
    grid_h = grid_h + 1
if grid_w % 2 == 0:
    grid_w = grid_w + 1

src_python.grid.utils.const.GRID.update({'HEIGHT': grid_h, 'WIDTH': grid_w})
src_python.grid.utils.const.update_enums()

if len(args.__getattribute__('dimensions')) == 3:
    prop_seed = args.__getattribute__('dimensions')[2]
else:
    prop_seed = args.__getattribute__('seed')

Main.Main(prop_seed)

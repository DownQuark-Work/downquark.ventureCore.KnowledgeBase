import argparse

import src_python.procedural.utils.const

from src_python.procedural import Main


# Argument parser
def build_arg_parser():
    # args are `width` `height` `seed`
    parser = argparse.ArgumentParser(description='procedural configuration')
    parser.add_argument('dimensions', metavar='Dimensions: int int', type=int, nargs='*',
                        default=[8, 17],
                        help='2 integers for the width and height of the procedural')
    parser.add_argument('seed', metavar='<seed>', type=int, nargs='?',
                        default=-1,
                        help='integer to seed the prng value')
    parser.add_argument(
        '--procedural-type', default='m', type=str,
        help='[c]ave, [d]ungeon, [m]aze, [r]oom, [R]ooms, [v]illage')
    parser.add_argument(
        '--algo', '-a', action='store_true',
        help='TODO: https://docs.python.org/3/library/argparse.html#parents')
    parser.add_argument(
        '--anim', '-A', action='store_true',
        help='animate procedural build')
    parser.add_argument(
        '--walled', '-w', action='store_true',
        help='render as walled procedural')
    return parser.parse_args()


args = {}
# only runs on init load
if __name__ == '__main__':
    args = build_arg_parser()
    print("""interesting:
    - 16 26 5810590
    - 8 13 58105907967881684749
    - 16 26 58
    - 16 26 134269
    - 20 40 17906106984432535371
    - 20 40 48866109023011662405 <-- had a few edge cases
    - 20 40 4886610902301166
    - 20 40 58884455474897919654
    - 8 12 13421342 -A <-- carved
    - 8 12 13421342 -Aw < -- walled
    - 20 40 588844554748979196545 -w
    """)

grid_h = args.__getattribute__('dimensions')[0]
grid_w = args.__getattribute__('dimensions')[1]

if grid_h % 2 == 0:
    grid_h = grid_h + 1
if grid_w % 2 == 0:
    grid_w = grid_w + 1

grid_type = True  # args.__getattribute__('grid_type')
tunnel_type = args.__getattribute__('walled')

src_python.procedural.utils.const.GRID.update({
    '_TYPE': 'MAZE',  # TODO: handle `grid_type` when more are available
    '_TYPE_TUNNEL': 'WALLED' if tunnel_type else 'CARVED',
    'ANIMATE': args.__getattribute__('anim'),
    'HEIGHT': grid_h, 'WIDTH': grid_w
})
src_python.procedural.utils.const.update_enums(tunnel_type)

if len(args.__getattribute__('dimensions')) == 3:
    prop_seed = args.__getattribute__('dimensions')[2]
else:
    prop_seed = args.__getattribute__('seed')

Main.Main(prop_seed)

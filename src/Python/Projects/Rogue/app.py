from src_python.procedural.utils import args as arg_utils, const as const_utils
from src_python.procedural import Controller

#  reference to model after:poetry env info
# https://github.com/grantjenks/free-pyth/blob/master/src/freegames/__init__.py

args = {}
# only runs on init load
if __name__ == '__main__':
    args = arg_utils.build_arg_parser()

grid_h = args.__getattribute__('dimensions')[0]
grid_w = args.__getattribute__('dimensions')[1]

if grid_h % 2 == 0:
    grid_h = grid_h + 1
if grid_w % 2 == 0:
    grid_w = grid_w + 1

if 'procgen' in args:
    """If command is referring to procedural generation"""
    const_utils.GRID.update({ # set the type of grid to be rendered
        '_TYPE': args.procgen.upper(), # 'MAZE', 'DUNGEON, 'SQUARE_DIAMOND', ...
    })
    if args.procgen == 'maze':
        """Handle Maze Procedural Generation options"""
        tunnel_type = args.__getattribute__('walled')
        const_utils.GRID.update({
            # '_MAZE_TYPE': 'SIDEWINDER', 'GROWING_TREE', ..., # TODO: implement when logic created
            '_TYPE_TUNNEL': 'WALLED' if tunnel_type else 'CARVED',
            'ANIMATE': args.__getattribute__('anim'),
            'HEIGHT': grid_h, 'WIDTH': grid_w
        })
        const_utils.update_enums(tunnel_type)

if len(args.__getattribute__('dimensions')) == 3:
    prop_seed = args.__getattribute__('dimensions')[2]
else:
    prop_seed = args.__getattribute__('seed')

Controller.Controller(prop_seed)

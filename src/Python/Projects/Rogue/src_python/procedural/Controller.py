from src_python.procedural.utils.const import (ENUM_DIR,
                                               ENUM_LAYOUT_TYPE,
                                               ENUM_MAZE_ALGORITHM,
                                               ENUM_OPTION_TYPE,
                                               extend_initial_enums)
from src_python.procedural.elements.board import Board
from src_python.procedural.proseedural import prng
from src_python.procedural.algorithms.DiamondSquare import DiamondSquareAlgorithm

# from src_python.database.rdbms import *

"""The hub/controller/what-have-you"""

# no_print_db()
# print_dbs()


def debug_grid_config(pointer):
    # print('pointer_len', len(str(pointer.rand_num)))
    print(f'bool', pointer.pos_val(ENUM_OPTION_TYPE.get('BOOL')))
    print(f'cardinal', pointer.pos_val(ENUM_OPTION_TYPE.get('DIR').get('CARDINAL')))
    print(f'surrounding', pointer.pos_val(ENUM_OPTION_TYPE.get('DIR').get('SURROUNDING')))
    one_off_arr = []
    for i in range(len(str(pointer.rand_num))):
        one_off_arr.append(str(pointer.rand_num)[i])
        map_val = pointer.pos_val(ENUM_OPTION_TYPE.get('DIR').get('SURROUNDING'))
        map_indexed = ENUM_DIR.get('_MAP')[map_val]
        position_offset = ENUM_DIR.get('SURROUNDING')[map_indexed]
        print(f'position_offset: ', map_indexed, position_offset, pointer.pos_index)
    print('one_off_arr', one_off_arr)
    for j in range(8):
        one_off_max_val = len(one_off_arr)*(8+j)
        one_off = pointer.pos_val(one_off_max_val)
        print('one_off_max_val :: one_off', one_off_max_val, one_off)


def config_pointer(prng_seed):
    pointer = prng.Walker(prng_seed)
    pointer.create_prng()
    # debug_grid_config(pointer)
    return pointer


def config_board(cnfg):
    board = Board.Board()
    board.configure(cnfg)


class Controller:
    """Top Level Controller for internals"""
    # This (and all level configs) would also eventually be fed in via a config file of some sort
    def __init__(self):
        pass
    def run_cmd(self):
        # TODO: enable this so the controller is actually in control
        # move a lot of the below to __init__ and make it more dynamic when running generators and algorithms
        pass

class CreatePRNGPointer:
    """Top Level Internals Controller :: Creates Walkable Pointer """
    def __init__(self, prng_seed):
        self._pointer = config_pointer(prng_seed)
        # print('self._pointer', self._pointer)
        # debug_grid_config(self._pointer)

class ConfigureEnvironment:
    """Top Level Environment Generation Handler"""
    def __init__(self, prng_seed):
        self._pointer = config_pointer(prng_seed)
        extend_initial_enums('MAZE')
        # debug_grid_config(self._pointer)
        config_board({'pointer': self._pointer, 'environments': {'type': ENUM_LAYOUT_TYPE.get('MAZE'), 'opts': {
            'type': ENUM_MAZE_ALGORITHM.get('GROWING_TREE').get('type'),
            # 'cell_selection': ENUM_MAZE_ALGORITHM.get('GROWING_TREE').get('cell_selection').get('NEWEST'),
            # .get('QUARTER')
            'cell_selection': [.3, .3, .3, .1],
            'recursive_actions': ENUM_MAZE_ALGORITHM.get('GROWING_TREE').get('method_index_map'),
        }}})

class ProcessAlgorithm:
    """Top Level Algorithm Handler"""
    def __init__(self, prng_seed,args):
        self._pointer = config_pointer(prng_seed)
        # print('self._pointer', self._pointer)
        if 'procgen' in args and args.procgen == 'DIAMOND_SQUARE':
            DiamondSquareAlgorithm(self._pointer, args)

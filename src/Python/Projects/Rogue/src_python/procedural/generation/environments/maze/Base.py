import time

from src_python.procedural.proseedural.prng import Walker
from src_python.procedural.utils.const import ENUM_LOCATION_IS_CARVEABLE, ENUM_TILE_TYPE, GRID, PRNG
from src_python.procedural.utils.decorators import with_config_grid
from src_python.procedural.utils.math import reduce, array_set
from src_python.procedural.utils.console import print_formatted_grid


@with_config_grid('ANIMATE')
def print_grid(do_animate=False):
    if do_animate:
        # time.sleep(.25)
        time.sleep(.01)
        print_formatted_grid()


class MazeBase:
    """common aspects to be used in multiple maze types"""
    def __init__(self):
        self._available_adjacent_indexes = []
        self._prng_pointer: Walker = PRNG.get('POINTER')
        self._path_maker = []
        self._unchecked_indexes = GRID.get('UNCARVED').copy()
        self._on_uncarved_indexes_exist = None
        self._on_undefined_next_cell = None

    @property
    def mazebase_prng_pointer(self):
        """_rand_num getter"""
        return self._prng_pointer

    @property
    def mazebase_path_maker(self):
        """_rand_num getter"""
        return self._path_maker

    @mazebase_path_maker.setter
    def mazebase_path_maker(self, value, method='APPEND'):
        if method == 'APPEND':
            self._path_maker.append(value)
        else:
            self._path_maker.remove(value)

    @mazebase_path_maker.deleter
    def mazebase_path_maker(self):
        del self._path_maker

    @property
    def on_uncarved_indexes_exist(self):
        """callback for procedural creation procedure"""
        return self._on_uncarved_indexes_exist

    @on_uncarved_indexes_exist.setter
    def on_uncarved_indexes_exist(self, fnc):
        self._on_uncarved_indexes_exist = fnc

    @property
    def on_undefined_next_cell(self):
        """callback for dead end"""
        return self._on_undefined_next_cell

    @on_undefined_next_cell.setter
    def on_undefined_next_cell(self, fnc):
        self._on_undefined_next_cell = fnc

    @staticmethod
    def mazebase_get_prev_tile_type(cur_dir=None, prev_tile=None):
        passage_tile = ENUM_TILE_TYPE.get('PASSAGE')
        outdated_tile = passage_tile.get(prev_tile)
        cur_tile = outdated_tile.get(cur_dir) if outdated_tile else cur_dir
        #   - debug below
        # print('tile_type', outdated_tile)
        # print('cur_dir=None, prev_tile=None', cur_dir, prev_tile)
        # print('tile_type', cur_tile, '')
        return cur_tile

    @staticmethod
    def set_cell_type_by_direction(cell_id, cell_type):
        GRID.get('BASE')[cell_id] = cell_type

    def mazebase_get_starting_point(self):
        init_cell = self._prng_pointer.pos_val(len(GRID.get('UNCARVED')))
        return int(GRID.get('UNCARVED')[init_cell])

    def carve_current_index(self, cell_indexes: [int], type_tile):
        """Updates path arrays for carving and overall progress monitoring"""
        for cell_value in cell_indexes:
            self._path_maker.append(cell_value)
            GRID.get('BASE')[cell_value] = type_tile
        self._unchecked_indexes.remove(cell_indexes[0])
        print_grid()

    def progress_build(self, vet_index: int) -> [int]:
        valid_uncarved_indexes = [vet_index for
                                  vet_index in
                                  [reduce(lambda x, y: x + y, ENUM_LOCATION_IS_CARVEABLE[vet_dir], vet_index)
                                   for vet_dir in ENUM_LOCATION_IS_CARVEABLE]
                                  # below checks if in range of the graph; -1 for carve offset (checks 2 positions out)
                                  if 0 <= vet_index < len(GRID.get('BASE')) - 1
                                  and GRID.get('BASE')[vet_index] == ENUM_TILE_TYPE.get('UNCARVED')]
        self._available_adjacent_indexes += valid_uncarved_indexes
        self._available_adjacent_indexes = array_set(self._available_adjacent_indexes)
        print_grid()
        if len(valid_uncarved_indexes):
            return self._on_uncarved_indexes_exist(vet_index, valid_uncarved_indexes)
        else:
            return None

    def get_cell_type_by_direction(self, to_cell, from_cell):
        type_passage = ENUM_TILE_TYPE.get('PASSAGE')
        type_tile = type_passage.copy()
        carve_dir_key = to_cell - from_cell
        prev_tile_type = GRID.get('BASE')[from_cell]
        if carve_dir_key == -1:
            type_tile = type_tile.get('W')
        elif carve_dir_key == 1:
            type_tile = type_tile.get('E')
        elif carve_dir_key > 0:
            type_tile = type_tile.get('S')
        else:
            type_tile = type_tile.get('N')

        if prev_tile_type != type_tile:
            return [type_tile, self.mazebase_get_prev_tile_type(type_tile, prev_tile_type)]
        else:
            return [type_tile, self.mazebase_get_prev_tile_type(type_tile, type_tile)]

    def generate_maze(self, cell_indexes: [int], prev_cell=None):
        type_tile = ENUM_TILE_TYPE.get('CORRIDOR')

        if GRID.get('_TYPE_TUNNEL') == 'WALLED' and prev_cell is not None:
            [dir_type_tile, prev_cell_type] = self.get_cell_type_by_direction(cell_indexes[0], prev_cell)
            type_tile = dir_type_tile
            self.set_cell_type_by_direction(prev_cell, prev_cell_type)

        self.carve_current_index(cell_indexes, type_tile)

        if len(self._unchecked_indexes) == 0:
            if GRID.get('_TYPE_TUNNEL') == 'WALLED' and prev_cell is not None:
                self.set_cell_type_by_direction(prev_cell, ENUM_TILE_TYPE.get('SOLID'))
            self.mazebase_create_egress()
            return

        next_cell = self.progress_build(cell_indexes[0])
        if next_cell is None:
            [next_cell, cell_indexes] = self._on_undefined_next_cell(next_cell, cell_indexes)
        self.generate_maze(next_cell, cell_indexes[0])

    def mazebase_create_egress(self):
        """mazes should somewhat attempt to have entrance/exit on different walls"""
        all_walls = GRID.get('PERIMETER').copy()

        all_walls_corners = [  # indexes of corner elements
            len(all_walls) - 1,
            len(all_walls) - GRID.get('WIDTH'),
            GRID.get('WIDTH') - 1,
            0,
        ]

        # remove corners before they can cause trouble
        for awc in all_walls_corners[:4]:
            all_walls_corners.append(all_walls[awc])  # and values of corner elements
            del all_walls[awc]  # remove corner indexes
        del all_walls_corners[:4]  # remove corner indexes
        all_walls_corners.sort()

        half_the_walls_amt = (len(all_walls) / 2).__ceil__()
        half_the_walls = [all_walls[:half_the_walls_amt], all_walls[half_the_walls_amt:]]
        entrance_half = self._prng_pointer.pos_val(len(half_the_walls))
        exit_half = abs(entrance_half - 1)
        egress_arr = [half_the_walls[entrance_half], half_the_walls[exit_half]]
        [egress_entrance_index, egress_exit_index] = [
            self._prng_pointer.pos_val(len(egress_arr[0])),
            self._prng_pointer.pos_val(len(egress_arr[1]))
        ]
        [egress_entrance_val, egress_exit_val] = [
            egress_arr[0][egress_entrance_index],
            egress_arr[1][egress_exit_index]
        ]

        GRID.get('BASE')[egress_entrance_val] = ENUM_TILE_TYPE.get('EGRESS').get('ENTER')
        GRID.get('BASE')[egress_exit_val] = ENUM_TILE_TYPE.get('EGRESS').get('EXIT')

        def carve_to_egress_pos(egress_pos_val):
            if egress_pos_val < all_walls_corners[1]:
                return egress_pos_val + GRID.get('WIDTH')
            elif egress_pos_val > all_walls_corners[2]:
                return egress_pos_val - GRID.get('WIDTH')
            elif egress_pos_val % GRID.get('WIDTH') == 0:
                return egress_pos_val + 1
            else:
                return egress_pos_val - 1

        for carve_solid in [egress_entrance_val, egress_exit_val]:
            if GRID.get('_TYPE_TUNNEL') == 'WALLED':
                egress_path = self.get_cell_type_by_direction(carve_solid, carve_to_egress_pos(carve_solid))
                GRID.get('BASE')[carve_to_egress_pos(carve_solid)] = egress_path[1]
            else:
                solid_to_carve = carve_to_egress_pos(carve_solid)
                GRID.get('BASE')[solid_to_carve] = ENUM_TILE_TYPE.get('CORRIDOR')

        print_formatted_grid()

    # Keeping for now - may be useful for another maze
    # def update_available_adjacent_indexes(self):
    #     for available_adjacent in self._available_adjacent_indexes:
    #         GRID.get('BASE')[available_adjacent] = ENUM_TILE_TYPE.get('AVAILABLE_ADJACENT')
    #
    def sync_valid_indexes(self, index_val):
        self._unchecked_indexes.remove(index_val)
        if self._available_adjacent_indexes.__contains__(index_val):
            self._available_adjacent_indexes.remove(index_val)

from src_python.grid.procgen.prng import Walker
from src_python.grid.utils.const import GRID, PRNG, ENUM_TILE_TYPE, ENUM_DIR
from src_python.grid.utils.math import reduce
from src_python.grid.utils.console import print_formatted_grid


class MazeBase:
    def __init__(self):
        self._available_adjacent_indexes = []
        self._prng_pointer: Walker = PRNG.get('POINTER')
        self._path_maker = []
        self._unchecked_indexes = GRID.get('UNCARVED').copy()

    def mazebase_get_starting_point(self):
        init_cell = self._prng_pointer.pos_val(len(GRID.get('UNCARVED')))
        return int(GRID.get('UNCARVED')[init_cell])

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

        # ensures there will be a corridor on the other side of the solid
        all_walls = [all_even_walls for all_even_walls in all_walls if all_even_walls % 2 == 0]

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
                return egress_pos_val+GRID.get('WIDTH')
            elif egress_pos_val > all_walls_corners[2]:
                return egress_pos_val - GRID.get('WIDTH')
            elif egress_pos_val % GRID.get('WIDTH') == 0:
                return egress_pos_val + 1
            else:
                return egress_pos_val - 1

        for carve_solid in [egress_entrance_val, egress_exit_val]:
            solid_to_carve = carve_to_egress_pos(carve_solid)
            GRID.get('BASE')[solid_to_carve] = ENUM_TILE_TYPE.get('CORRIDOR')

        print_formatted_grid()

    def update_available_adjacent_indexes(self):
        for available_adjacent in self._available_adjacent_indexes:
            GRID.get('BASE')[available_adjacent] = ENUM_TILE_TYPE.get('AVAILABLE_ADJACENT')

    def sync_valid_indexes(self, index_val):
        self._unchecked_indexes.remove(index_val)
        if self._available_adjacent_indexes.__contains__(index_val):
            self._available_adjacent_indexes.remove(index_val)
        self.update_available_adjacent_indexes()

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

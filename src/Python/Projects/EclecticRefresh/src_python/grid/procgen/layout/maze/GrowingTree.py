import time

from src_python.grid.utils.const import ENUM_LOCATION_IS_CARVEABLE, ENUM_TILE_TYPE, GRID
from src_python.grid.utils.console import print_formatted_grid
from src_python.grid.utils.math import array_set, reduce
from src_python.grid.procgen.layout.maze.Base import MazeBase


def explode_recurse_arr(cell_select):
    """Creates 100 item array for simplistic seed selection"""
    cell_select_explode = []
    cell_select_index = 0
    for i in cell_select:
        for h in range(int(i * 100)):
            cell_select_explode.append(cell_select_index)
        cell_select_index += 1
    return cell_select_explode


def print_grid():
    time.sleep(0)
    # time.sleep(.25)
    # print_formatted_grid()


class MazeGrowingTree(MazeBase):
    """Creates seeded Growing Tree Maze"""

    def __init__(self, maze_opts):
        super().__init__()
        # print('CLASS: making growing tree with opts:', maze_opts)
        self._recurse_arr = explode_recurse_arr(maze_opts.get('cell_selection'))
        self._recursive_methods = maze_opts.get('recursive_actions')
        self._recurse_index = -1
        starting_index = self.mazebase_get_starting_point()
        self.carve_current_index([starting_index])

    def update_recurse_token(self, recurse_index):
        if self._recurse_index > -1:
            old_index = GRID.get('BASE').index(ENUM_TILE_TYPE.get('RECURSE'))
            GRID.get('BASE')[old_index] = ENUM_TILE_TYPE.get('CORRIDOR')
        self._recurse_index = recurse_index
        if recurse_index > -1:
            GRID.get('BASE')[recurse_index] = ENUM_TILE_TYPE.get('RECURSE')

    def determine_recursive_index(self):
        recursive_action_index = self._prng_pointer.pos_val(len(self._recurse_arr))
        determined_recursive_action = self._recurse_arr[recursive_action_index]

        def apply_recursive_backtrack(use_oldest_val=False):
            """Applies recursive backtracking to complete maze"""
            if use_oldest_val:
                # due to our first run set-up this implementation needs to be handled slightly differently
                if self._path_maker[0] % 2 == 0:
                    recursive_index = self._path_maker[0]  # this has only during the first regression run
                    del self._path_maker[0]  # no grouping due to first run set-up. delete only [0]
                else:
                    recursive_index = self._path_maker[1] # all other iters use this to find uncarved tiles
                    del self._path_maker[0:1]  # delete grouping when used
            else:
                self._path_maker.pop()  # this is the index surrounded by SOLID
                recursive_index = self._path_maker.pop()  # this has the potential to find uncarved tiles
            self.update_recurse_token(recursive_index)
            self.vet_next_index(recursive_index)

        def apply_median_backtrack():
            """uses values in the middle of the current array as recursive starting points"""
            median = (len(self._path_maker)/2).__ceil__()  # median value will always be surrounded by SOLID
            recursive_index = self._path_maker[median-1]  # grouping was created as [median-1,median]
            # delete the grouping after storing for future iterations to work
            del self._path_maker[median-1:median]
            self.update_recurse_token(recursive_index)
            self.vet_next_index(recursive_index)

        def apply_prims_backtrack():
            """Applies a seeded random index for recursive validation"""
            prim_index = self._prng_pointer.pos_val(len(self._path_maker))
            prim_num = self._path_maker[prim_index]
            #  acknowledges caveats:
            if prim_num % 2 != 0:
                prim_index += 1  # must be even
            #  reset to acknowledge even/odd
            prim_num = self._path_maker[prim_index]

            if prim_index == 0:
                del self._path_maker[0]  # zero is special due to start script
            else:  # removes grouping when available
                del self._path_maker[prim_num - 1:prim_num]
            self.update_recurse_token(prim_num)
            self.vet_next_index(prim_num)

        recursive_actions = {
            # method_index_map
            self._recursive_methods['NEWEST']: lambda: apply_recursive_backtrack(),
            self._recursive_methods['MIDDLE']: lambda: apply_median_backtrack(),
            self._recursive_methods['OLDEST']: lambda: apply_recursive_backtrack(True),
            self._recursive_methods['RANDOM']: lambda: apply_prims_backtrack(),
        }
        recursive_actions[determined_recursive_action]()

    def vet_next_index(self, vet_index: int):
        valid_uncarved_indexes = [vet_index for
                                  vet_index in
                                  [reduce(lambda x, y: x + y, ENUM_LOCATION_IS_CARVEABLE[vet_dir], vet_index)
                                   for vet_dir in ENUM_LOCATION_IS_CARVEABLE] if
                                  GRID.get('BASE')[vet_index] == ENUM_TILE_TYPE.get('UNCARVED') or GRID.get('BASE')[
                                      vet_index] == ENUM_TILE_TYPE.get('AVAILABLE_ADJACENT')]
        self._available_adjacent_indexes += valid_uncarved_indexes
        self._available_adjacent_indexes = array_set(self._available_adjacent_indexes)
        self.update_available_adjacent_indexes()
        print_grid()
        if len(valid_uncarved_indexes):
            self.update_recurse_token(-1)
            valid_uncarved_index = self._prng_pointer.pos_val(len(valid_uncarved_indexes))
            sorted_vet_indexes = [vet_index, valid_uncarved_indexes[valid_uncarved_index]]
            sorted_vet_indexes.sort()
            solid_carve_index = int(sorted_vet_indexes[0] + ((sorted_vet_indexes[1] - sorted_vet_indexes[0]) / 2))
            GRID.get('BASE')[valid_uncarved_indexes[valid_uncarved_index]] = ENUM_TILE_TYPE.get('VETTING')
            GRID.get('BASE')[solid_carve_index] = ENUM_TILE_TYPE.get('VETTING')
            print_grid()
            self.carve_current_index([valid_uncarved_indexes[valid_uncarved_index], solid_carve_index])
        else:
            if len(self._unchecked_indexes):
                self.determine_recursive_index()
            else:
                self.mazebase_create_egress()

    def carve_current_index(self, cell_indexes: [int]):
        """Updates path arrays for carving and overall progress monitoring"""
        cell_values = [iterable_index for iterable_index in cell_indexes]
        for cell_value in cell_values:
            self._path_maker.append(cell_value)
            GRID.get('BASE')[cell_value] = ENUM_TILE_TYPE.get('CORRIDOR')
        self.sync_valid_indexes(cell_values[0])
        print_grid()
        if len(self._unchecked_indexes):
            self.vet_next_index(cell_values[0])
        else:
            self.mazebase_create_egress()

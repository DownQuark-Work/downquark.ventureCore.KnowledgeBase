import time
from typing import Any, Callable

from src_python.procedural.utils.const import ENUM_LOCATION_IS_CARVEABLE, ENUM_TILE_TYPE, GRID
from src_python.procedural.utils.math import reduce
from src_python.procedural._generation.layout.maze.Base import MazeBase, print_grid


def explode_recurse_arr(cell_select):
    """Creates 100 item array for simplistic seed selection"""
    cell_select_explode = []
    cell_select_index = 0
    for i in cell_select:
        for h in range(int(i * 100)):
            cell_select_explode.append(cell_select_index)
        cell_select_index += 1
    return cell_select_explode


class MazeGrowingTree(MazeBase):
    """Creates seeded Growing Tree Maze"""

    def __init__(self, maze_opts):
        super().__init__()
        # print('maze_opts', maze_opts); exit(1)
        self._recurse_arr = explode_recurse_arr(maze_opts.get('cell_selection'))
        self._recursive_methods = maze_opts.get('recursive_actions')
        self._recurse_index = -1
        starting_index = self.mazebase_get_starting_point()
        self.on_uncarved_indexes_exist = self.valid_uncarved_indexes
        self.on_undefined_next_cell = self.define_next_cell
        self.generate_maze([starting_index, starting_index])

    def valid_uncarved_indexes(self, vet_index, valid_uncarved_indexes):
        self.update_recurse_token(-1)
        valid_uncarved_index = self._prng_pointer.pos_val(len(valid_uncarved_indexes))
        sorted_vet_indexes = [vet_index, valid_uncarved_indexes[valid_uncarved_index]]
        sorted_vet_indexes.sort()
        solid_carve_index = (
            int(sorted_vet_indexes[0] + ((sorted_vet_indexes[1] - sorted_vet_indexes[0]) / 2))
            if GRID.get('_TYPE_TUNNEL') == 'CARVED' else valid_uncarved_indexes[valid_uncarved_index]
        )
        GRID.get('BASE')[valid_uncarved_indexes[valid_uncarved_index]] = ENUM_TILE_TYPE.get('VETTING')
        GRID.get('BASE')[solid_carve_index] = ENUM_TILE_TYPE.get('VETTING')
        print_grid()
        return [valid_uncarved_indexes[valid_uncarved_index], solid_carve_index]

    def define_next_cell(self, init_next_cell, init_cell_indexes):
        next_cell = init_next_cell
        cell_indexes = init_cell_indexes

        if GRID.get('_TYPE_TUNNEL') == 'WALLED':
            GRID.get('BASE')[cell_indexes[0]] = ENUM_TILE_TYPE.get('SOLID')
        apply_recursive_action = self._prng_pointer.pos_val(len(self._recurse_arr))
        while next_cell is None:
            recursive_index = self.determine_recursive_index(apply_recursive_action)
            if GRID.get('_TYPE_TUNNEL') == 'WALLED':
                cell_indexes = [recursive_index, recursive_index]
            next_cell = self.progress_build(recursive_index)

        return [next_cell, cell_indexes]

    def update_recurse_token(self, recurse_index):
        if self._recurse_index > -1:
            if GRID.get('_TYPE_TUNNEL') != 'WALLED':
                old_index = GRID.get('BASE').index(ENUM_TILE_TYPE.get('RECURSE'))
                GRID.get('BASE')[old_index] = ENUM_TILE_TYPE.get('CORRIDOR')
        self._recurse_index = recurse_index
        if recurse_index > -1:
            if GRID.get('_TYPE_TUNNEL') != 'WALLED':
                GRID.get('BASE')[recurse_index] = ENUM_TILE_TYPE.get('RECURSE')

    def determine_recursive_index(self, recursive_action_index):
        determined_recursive_action = self._recurse_arr[recursive_action_index]

        def apply_recursive_backtrack(use_oldest_val=False):
            """Applies recursive backtracking to complete maze"""
            if use_oldest_val:
                recursive_index = self._path_maker[0]  # all other iters use this to find uncarved tiles
                del self._path_maker[0]  # delete grouping when used
            else:
                self._path_maker.pop()  # this is the index surrounded by SOLID
                recursive_index = self._path_maker.pop()  # this has the potential to find uncarved tiles
            self.update_recurse_token(recursive_index)
            return recursive_index

        def apply_median_backtrack():
            """uses values in the middle of the current array as recursive starting points"""
            median = (len(self._path_maker) / 2).__ceil__()  # median value will always be surrounded by SOLID
            # max ensures edge case of median == 0 is handled correctly
            recursive_index = self._path_maker[max(median - 1, 0)]  # grouping was created as [median-1,median]
            # delete the grouping after storing for future iterations to work
            del self._path_maker[max(median - 1, 0):median]
            self.update_recurse_token(recursive_index)
            return recursive_index

        def apply_prims_backtrack():
            """Applies a seeded random index for recursive validation"""
            if GRID.get('_TYPE_TUNNEL') == 'WALLED':
                prim_index = self._prng_pointer.pos_val(len(self._path_maker))
                prim_index = self._path_maker[prim_index]
                self._path_maker.remove(prim_index)
                return prim_index

            prim_index = self._prng_pointer.pos_val(len(self._available_adjacent_indexes))
            prim_index = self._available_adjacent_indexes[prim_index]
            self._available_adjacent_indexes.remove(prim_index)

            prim_choices = [prim_index for prim_index in
                            [reduce(lambda x, y: x + y, ENUM_LOCATION_IS_CARVEABLE[prim_dir], prim_index)
                             for prim_dir in ENUM_LOCATION_IS_CARVEABLE]
                            if 0 <= int(prim_index) < len(GRID.get('BASE')) - 1
                            and GRID.get('BASE')[prim_index] == ENUM_TILE_TYPE.get('CORRIDOR')]
            prim_chosen = prim_choices[self._prng_pointer.pos_val(len(prim_choices))]
            GRID.get('BASE')[prim_chosen] = ENUM_TILE_TYPE.get('CORRIDOR')
            if self._path_maker.__contains__(prim_chosen):
                if self._path_maker.__contains__(prim_chosen - 1):
                    self._path_maker.remove(prim_chosen - 1)
                self._path_maker.remove(prim_chosen)
            return prim_chosen

        # method_index_map
        recursive_actions: dict[Any, Callable] = {
            self._recursive_methods['NEWEST']: lambda: apply_recursive_backtrack(),
            self._recursive_methods['MIDDLE']: lambda: apply_median_backtrack(),
            self._recursive_methods['OLDEST']: lambda: apply_recursive_backtrack(True),
            self._recursive_methods['RANDOM']: lambda: apply_prims_backtrack(),
        }
        return recursive_actions[determined_recursive_action]()
        # return apply_recursive_backtrack(True)
        # return apply_recursive_backtrack()
        # return apply_prims_backtrack()
        # return apply_median_backtrack()

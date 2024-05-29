import math
from src_python.grid.procgen.layout.maze import _create
from src_python.grid.utils.const import (GRID, ENUM_TILE_TYPE)


def configure_initial_ascii(grid_full_border):
    """create base carve-able grid"""
    carve_able_grid = []
    carve_able_cells = []
    egress_able_cells = []
    for cell in grid_full_border[0]:
        if math.floor(cell / GRID.get('WIDTH')) % 2 == 0 and cell % 2 == 0:
            carve_able_cells.append(cell)
            carve_able_grid.append(ENUM_TILE_TYPE.get('UNCARVED'))
        else:
            carve_able_grid.append(ENUM_TILE_TYPE.get('SOLID'))
    for cell in grid_full_border[1]:
        carve_able_grid[cell] = ENUM_TILE_TYPE.get('PERIMETER')
        try:
            #  remove border cells from carvable, and if removed add it to the egress list
            carve_able_cells.remove(cell)
            egress_able_cells.append(cell)
        except ValueError:
            #  print(f'Element not in list !', cell)
            pass
    # persist special cell types
    GRID.update({'UNCARVED': carve_able_cells, 'EGRESSABLE': egress_able_cells})
    return carve_able_grid


def determine_grid_border_indexes(grid, w):
    """utilize the width from `init_grid_config` to create a list containing the perimeter indexes"""
    return [cell for cell in grid if ((cell < w) | (cell > len(grid) - w) | (cell % w == 0) | (cell % w == (w - 1)))]


def init_grid_config(height, width):
    """given width, height, and fill characters return initial grid"""
    init_grid = list(range(0, height * width))
    grid_border = determine_grid_border_indexes(init_grid, width)
    uncarved_grid = configure_initial_ascii([init_grid, grid_border])
    GRID.update({'BASE': uncarved_grid, 'PERIMETER': grid_border})


def create_maze(opts):
    init_grid_config(GRID.get('HEIGHT'), GRID.get('WIDTH'))
    _create.main_maze(opts)

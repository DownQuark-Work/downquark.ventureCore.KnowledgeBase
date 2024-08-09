import math

from src_python.procedural.generation.Grid import Grid as GridBase
from src_python.procedural.generation.environments.maze import create
from src_python.procedural.utils.const import (GRID, ENUM_TILE_TYPE)
from src_python.procedural.utils.const.maze import ENUM_MAZE_CREATION_TYPE


def configure_initial_ascii(grid_full_border):
    """create base carve-able procedural"""
    maze_creation_type = GRID.get('_TYPE_TUNNEL')
    if maze_creation_type not in ENUM_MAZE_CREATION_TYPE:
        raise ValueError(f'{maze_creation_type} does not exist in ENUM_MAZE_CREATION_TYPE.')

    carve_able_grid = []
    carve_able_cells = []
    egress_able_cells = []

    for cell in grid_full_border[0]:
        if maze_creation_type == 'WALLED':
            carve_able_cells.append(cell)
            carve_able_grid.append(ENUM_TILE_TYPE.get('UNCARVED'))
        elif maze_creation_type == 'CARVED':
            if math.floor(cell / GRID.get('WIDTH')) % 2 == 1 and cell % 2 == 0:
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


def create_maze(opts):
    GridBase().create_grid()
    uncarved_grid = configure_initial_ascii([GRID.get('BASE'), GRID.get('PERIMETER')])
    GRID.update({'BASE': uncarved_grid})
    create.main_maze(opts)

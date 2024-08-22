import os
from src_python.procedural.utils.const import ENUM_TILE_TYPE, GRID


# define clear function
def clear():
    """Clear the console"""
    os.system('clear')


def print_formatted_grid(grid=None, width=0):
    """log given procedural, breaking on each `width` index"""
    # clear()
    if grid is None:
        grid = GRID.get('BASE')
    if width == 0:
        width = GRID.get('WIDTH')

    formatted_grid = []
    for grid_item in grid:
        if grid_item is None:  # failsafe / edge case
            grid_item = ENUM_TILE_TYPE.get('SOLID')
        formatted_grid.append(str(grid_item))
        if len(formatted_grid) == width:
            print(' '.join(formatted_grid))
            formatted_grid = []

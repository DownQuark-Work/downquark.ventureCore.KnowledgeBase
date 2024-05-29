import os
from src_python.grid.utils.const import GRID


# define clear function
def clear():
    """Clear the console"""
    os.system('clear')


def print_formatted_grid(grid=None, width=0):
    """log given grid, breaking on each `width` index"""
    # clear()
    if grid is None:
        grid = GRID.get('BASE')
    if width is 0:
        width = GRID.get('WIDTH')

    formatted_grid = []
    for grid_item in grid:
        formatted_grid.append(grid_item)
        if len(formatted_grid) == width:
            print(' '.join(formatted_grid))
            formatted_grid = []

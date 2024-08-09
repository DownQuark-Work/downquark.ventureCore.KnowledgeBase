from src_python.procedural.utils.const import GRID

"""The base grid instance. Contains pseudo 2D array from 1D source"""

class Grid:
    def __init__(self):
        self._h = 0
        self._w = 0
        print('happening')

    @staticmethod
    def determine_grid_border_indexes(grid, w):
        """utilize the width from `init_grid_config` to create a list containing the perimeter indexes"""
        return [cell for cell in grid if ((cell < w) | (cell > len(grid) - w) | (cell % w == 0) | (cell % w == (w - 1)))]


    def init_grid_config(self):
        """given width, height, and fill characters return initial procedural"""
        init_grid = list(range(0, self._h * self._w)) # <-- initial grid created here
        grid_border = self.determine_grid_border_indexes(init_grid, self._w)
        GRID.update({'BASE': init_grid, 'PERIMETER': grid_border})


    def create_grid(self):
        self._h = GRID.get('HEIGHT')
        self._w = GRID.get('WIDTH')
        self.init_grid_config()

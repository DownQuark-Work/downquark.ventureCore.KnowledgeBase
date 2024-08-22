import math
from collections import OrderedDict

from src_python.procedural.utils import const as const_utils
from src_python.procedural.generation.Grid import Grid # TODO: this should also be in Controller.__init__
from src_python.procedural.utils.console import print_formatted_grid

# py app.py 3 0 77211 DS
# py app.py 4 0 77211 DS -j 0
# py app.py 4 0 77211 DS -j 1
MAX_POWER_SIZE = 5

class DiamondSquareAlgorithm:
    def __init__(self,prng_pointer, ds_args):
        self._prng_pointer = prng_pointer
        self._ds_args = ds_args
        self.instantiate_grid_data()
        self._step_size = 0 # const_utils.GRID.get('HEIGHT') - 1
        self._jitter = self._ds_args.jitter
        self._grid = const_utils.GRID.get('BASE').copy()
        self.determine_algorithm_points()

    @property
    def step_size(self):
        """_step_size getter"""
        return self._step_size

    @step_size.setter
    def step_size(self, value):
        self._step_size = value

    @property
    def jitter(self):
        """_jitter getter"""
        return self._jitter

    @jitter.setter
    def jitter(self, value):
        self._jitter = value


    @staticmethod
    def instantiate_grid_data():
        # TODO: remove forcing to square when complete - handle step size of w & h separately
        grid_power = min(const_utils.GRID.get('HEIGHT'),MAX_POWER_SIZE)
        grid_dimension = int(math.pow(2,grid_power)) + 1
        const_utils.GRID.update({
            'HEIGHT': grid_dimension,
            'WIDTH':  grid_dimension, # temp forcing to square
            # 'WIDTH': min(const_utils.GRID.get('WIDTH'), MAX_GRID_SIZE),
        })
        Grid().create_grid()
        const_utils.update_enums(False)

    def determine_algorithm_points(self):
        transversal_direction = {
            'DIAGONAL':['SE', 'SW', 'NE', 'NW']
        }
        self.step_size = const_utils.GRID.get('HEIGHT') - 1
        tmp_step_size = self.step_size # remove this when all points acquired

        # reset grid values
        for idx in self._grid:
            self._grid[idx] = '.'

        diamonds: list | list[(int, int, int, int), int] = []
        diamond_step_map={}
        squares:list|list[(int,int,int,int),int,int] = []
        pts_recurse = [[0]]
        def get_algorithm_points(start_point,trans_dir_indx):
            square_start_point = start_point

            diagonal_trans_dir = transversal_direction['DIAGONAL'][trans_dir_indx]
            [diagonal, transversal] = const_utils.ENUM_DIR.get('DIAGONAL').get(diagonal_trans_dir)
            diagonal_transversal = (diagonal + transversal) * self.step_size

            [cardinal, transversal] = const_utils.ENUM_DIR.get('CARDINAL').get(diagonal_trans_dir[1])
            cardinal_transversal_horizontal = (cardinal + transversal) * self.step_size
            [cardinal, transversal] = const_utils.ENUM_DIR.get('CARDINAL').get(diagonal_trans_dir[0])
            cardinal_transversal_vertical = (cardinal + transversal) * self.step_size

            midpoint = int(start_point + ((diagonal + transversal) * (self.step_size/2)))

            square_points = (square_start_point, int(square_start_point + cardinal_transversal_horizontal),
                             int(square_start_point + cardinal_transversal_vertical),
                             int(square_start_point + diagonal_transversal))

            sq_points_list = list(square_points)
            sq_points_list.sort()

            diamond_points = (
                int(midpoint - abs(cardinal_transversal_vertical / 2)),
                int(midpoint - abs(cardinal_transversal_horizontal / 2)),
                int(midpoint + abs(cardinal_transversal_horizontal / 2)),
                int(midpoint + abs(cardinal_transversal_vertical / 2)),
            )

            diamond_step_map_key = int(self.step_size/2)
            if diamond_step_map_key not in diamond_step_map:
                diamond_step_map[diamond_step_map_key] = set(diamond_points)
            else:
                diamond_step_map[diamond_step_map_key].update(list(diamond_points))

            pts_recurse.append(sq_points_list)
            squares.append([square_points,midpoint,diamond_step_map_key])
            diamonds.append([diamond_points,diamond_step_map_key])

        while self.step_size > 1:
            _cur_pts_recurse = pts_recurse.copy()

            pts_recurse.clear()
            _pointer = 0
            for _cur_pts_recurse in _cur_pts_recurse:
                for pt in _cur_pts_recurse:
                    # print('pt', _pointer, pt)
                    get_algorithm_points(pt,_pointer%4)
                    _pointer = _pointer + 1
            self.step_size = self.step_size / 2

        self.step_size = tmp_step_size  # remove this when all points acquired
        self.apply_algorithm_diamond_square(squares, diamond_step_map)

    def apply_algorithm_diamond_square(self,squares, diamonds):
        DS_MAX_VALUE = self._ds_args.range_output[1]
        DS_MIN_VALUE = self._ds_args.range_output[0]

        # print('squares, diamonds',squares, diamonds)
        def get_value_in_arg_range():
            return max(DS_MIN_VALUE,self._prng_pointer.pos_val(DS_MAX_VALUE))
        def set_value_in_jitter_range(iter_amt):
            cur_jitter = min(1,max(0,self._ds_args.jitter)) ** iter_amt
            self.jitter = cur_jitter
            # print('jitter',self.jitter)
            # _ = self._prng_pointer.pos
            # self.jitter = (cur_jitter * (self._prng_pointer.pos_val(100)/100)) + (1.0 - cur_jitter)

        def make_avg_from_list(num_list):
            point_vals = [self._grid[pt] for pt in num_list]
            points_avg = sum(point_vals) / len(point_vals)
            return points_avg + (self.jitter * points_avg)
        def step_diamond(offset_amt):
            # todo: make dynamic with above usage
            cur_diamond_points = diamonds[offset_amt]
            [cardinal, transversal] = const_utils.ENUM_DIR.get('CARDINAL').get('E')
            cardinal_transversal_horizontal = (cardinal + transversal) * offset_amt
            [cardinal, transversal] = const_utils.ENUM_DIR.get('CARDINAL').get('S')
            cardinal_transversal_vertical = (cardinal + transversal) * offset_amt

            # if not wrapping need the below
            grid_len = len(const_utils.GRID.get('BASE'))
            row_width = const_utils.GRID.get('WIDTH')
            for cur_diamond_point in cur_diamond_points:
                # print('cur_diamond_point',cur_diamond_point)
                cur_diamond_offsets = []
                # TODO: handle wrapping logic
                # if not wrapping, do not average the horiz values outside of the row
                cur_row = math.floor(cur_diamond_point / row_width) % row_width
                cur_row_range = [row_width*cur_row,row_width*cur_row+row_width-1]
                # print('cur_row_range', cur_row_range)
                # todo: clean below
                if cur_row_range[0] <= cur_diamond_point + cardinal_transversal_horizontal <= cur_row_range[1]:
                    cur_diamond_offsets.append(cur_diamond_point + cardinal_transversal_horizontal)
                if cur_row_range[0] <= cur_diamond_point - cardinal_transversal_horizontal <= cur_row_range[1]:
                    cur_diamond_offsets.append(cur_diamond_point - cardinal_transversal_horizontal)
                # if not wrapping do not average the vert values that are negative or larger than the grid
                if 0 <= cur_diamond_point + cardinal_transversal_vertical <= grid_len:
                    cur_diamond_offsets.append(cur_diamond_point + cardinal_transversal_vertical)
                if 0 <= cur_diamond_point - cardinal_transversal_vertical <= grid_len:
                    cur_diamond_offsets.append(cur_diamond_point - cardinal_transversal_vertical)
                diamond_pt_avg = make_avg_from_list(cur_diamond_offsets)
                self._grid[cur_diamond_point] = diamond_pt_avg

        def step_square(cur_square):
            square_points = cur_square.pop(0)
            square_midpoint_val = make_avg_from_list(square_points)
            square_midpoint = cur_square.pop()
            # print('square_midpoint',square_midpoint)
            self._grid[square_midpoint] = square_midpoint_val

        # set initial values
        initial_points = squares[0]
        initial_points = initial_points[0]
        init_with_wrap_value = get_value_in_arg_range()
        for initial_point in initial_points:
            _ = self._prng_pointer.pos
            self._grid[initial_point] = init_with_wrap_value if self._ds_args.wrap else get_value_in_arg_range()

        cur_iteration_offset = squares[0][2]
        jitter_iteration = 1
        for square in squares:
            cur_square_offset = square.pop()
            if cur_square_offset is not cur_iteration_offset:
                # handle all diamonds by offset (step-size) value
                step_diamond(cur_iteration_offset)
                cur_iteration_offset = cur_square_offset
            # set all square mid-points for current step-size
            step_square(square)
            set_value_in_jitter_range(jitter_iteration)
            jitter_iteration = jitter_iteration + 1
        step_diamond(cur_iteration_offset)
        print_formatted_grid(self._grid)

        # print('running with args: ', self._prng_pointer, self._ds_args)

from src_python.grid.procgen.layout import maze
from src_python.grid.utils import const as CONST
from src_python.grid.utils.console import print_formatted_grid

"""Used to distinguish procedurally generated level types"""


class Board:
    """Determines and displays procedurally generated levels"""

    def __init__(self, ):
        """Instantiate Board with basic grid settings"""

    def create_maze(self, maze_opts):
        """Create initial grid and proc-generated maze"""
        created_maze = maze.create_maze(maze_opts)

        print('created_maze', created_maze)

    def configure(self, conf):
        """Handle Specified Configuration Process"""
        print(f'conf: ', conf.get('pointer'))
        # For Player
        # - TBD
        # match player_type:
        #  case 'HUMAN':
        # For Layout
        # - Maze -- more to come
        layout_init = {
            'DUNGEON': lambda opts: print('TODO: make cell-aut & flood fill'),
            'MAZE': lambda opts: self.create_maze(opts),
            'ETC': lambda opts: print("TODO: rooms, village, etc"),
        }
        layout_init.get(conf.get('layout').get('type'))(conf.get('layout').get('opts'))


from src_python.procedural._proseedural import prng
from src_python.procedural._generation.layout import maze

"""Used to distinguish procedurally generated level types"""


class Board:
    """Determines and displays procedurally generated levels"""

    def __init__(self, ):
        """Instantiate Board with basic procedural settings"""

    @staticmethod
    def create_maze(maze_opts):
        """Create initial procedural and proc-generated maze"""
        maze.create_maze(maze_opts)
        print('created_maze with seed:\n\t--', prng.initial_seed)

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


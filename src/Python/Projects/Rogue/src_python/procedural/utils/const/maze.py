def apply_maze_enum_updates(base_grid):
    base_grid.update({'MAZE_TYPE': None, 'UNCARVED': [], 'EGRESSABLE': []})


ENUM_MAZE_CREATION_TYPE = {
    'CARVED',
    'WALLED',
}

ENUM_LOCATION_IS_CARVEABLE = {
    'E': [2, 0],
    'N': [0, 0],
    'S': [0, 0],
    'W': [-2, 0],
}

opts_growing_tree = {
    'type': 'GROWING_TREE',
    'cell_selection': {
        'CUSTOM': [0, 0, 0, 0],  # for override
        'NEWEST': [1, 0, 0, 0],  # recursive backtrack
        'MIDDLE': [0, 1, 0, 0],
        'OLDEST': [0, 0, 1, 0],
        'RANDOM': [0, 0, 0, 1],  # prims
        'NEW_MID_50_50': [.5, .5, 0, 0],
        'NEW_RAND_50_50': [.5, 0, .5, 0],
        'QUARTER': [.25, .25, .25, .25]
    },
    'method_index_map': {
        'NEWEST': 0,  # recursive backtrack
        'MIDDLE': 1,
        'OLDEST': 2,
        'RANDOM': 3,  # prims
        '0': 'NEWEST',  # recursive backtrack
        '1': 'MIDDLE',
        '2': 'OLDEST',
        '3': 'RANDOM',  # prims

    }
}
ENUM_MAZE_ALGORITHM = {
    'GROWING_TREE': opts_growing_tree,
    'KRUSKAL': {type: 'KRUSKAL'},
    'ELLERS': {type: 'ELLERS'},
    'SIDEWINDER': {type: 'SIDEWINDER'},
    'RECURSIVE_DIVISION': {type: 'RECURSIVE_DIVISION'},
}

# Tiles
# 'UNCARVED': '☀⨀⟐⊡🀫⊞𝜩'
ENUM_TILE_TYPE = {
    'AVAILABLE_ADJACENT': '+',
    'CORRIDOR': ' ',
    'EGRESS': {'ENTER': '\x1b[1;35m🝊\x1b[0m', 'EXIT': '\x1b[1;33m↯\x1b[0m'},
    'UNCARVED': '⨀',
    'PASSAGE': {
        # Single direction
        'E': '→', 'N': '↑', 'S': '↓', 'W': '←',
        # Dual direction
        # ' ': {'→': '→', '↑': '↑', '↓': '↓', '←': '←',},
        '→': {'→': '↔', '↑': '┘', '↓': '┐', '←': '↔', },  # East
        '↑': {'→': '┌', '↓': '↕', '←': '┐', '↑': '↕'},  # North
        '↓': {'→': '└', '↑': '↕', '←': '┘', '↓': '↕'},  # South
        '←': {'→': '↔', '↑': '└', '↓': '┌', '←': '↔'},  # West
        # Triple direction
        '↔': {'↑': '⊥', '↓': '⊤'},
        '↕': {'→': '⊢', '←': '⊣'},
        # '⟐': {'→': '⊢', '←': '⊣'},
        # '⊞': {'→': '⊢', '←': '⊣'},
        '┌': {'↑': '⊢', '←': '⊤'},
        '┐': {'↑': '⊣', '→': '⊤'},
        '└': {'←': '⊥', '↓': '⊢'},
        '┘': {'→': '⊥', '↓': '⊣'},
        # Full
        '⊤': {'↑': '+'},
        '⊢': {'←': '+'},
        '⊣': {'→': '+'},
        '⊥': {'↓': '+'},
    },
    'PERIMETER': '#',
    'RECURSE': '¿',
    'SOLID': '⊞',
    'VETTING': '?',
}

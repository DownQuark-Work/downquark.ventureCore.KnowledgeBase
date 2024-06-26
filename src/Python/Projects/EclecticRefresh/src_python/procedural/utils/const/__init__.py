from src_python.procedural.utils.const.maze import *

# Enums
GRID = {
    '_TYPE': None,
    '_TYPE_TUNNEL': None,
    'ANIMATE': False,
    'HEIGHT': 0,
    'WIDTH': 0,
    'BASE': [],
    'PERIMETER': [],
}
PRNG = {
    'POINTER': None,
}

_ENUM_DIR_CARDINAL = {
    'E': [1, 0],
    'N': [0, -GRID.get('WIDTH')],
    'S': [0, GRID.get('WIDTH')],
    'W': [-1, 0],
}
_ENUM_DIR_CORNER = {
    'NE': [1, -GRID.get('WIDTH')],
    'NW': [-1, -GRID.get('WIDTH')],
    'SE': [1, GRID.get('WIDTH')],
    'SW': [-1, GRID.get('WIDTH')],
}
ENUM_DIR = {
    '_MAP': ['N', 'E', 'S', 'W', 'NE', 'NW', 'SE', 'SW'],
    'CARDINAL': _ENUM_DIR_CARDINAL,
    'DIAGONAL': _ENUM_DIR_CORNER,
    'SURROUNDING': {**_ENUM_DIR_CARDINAL, **_ENUM_DIR_CORNER},  # `**` is unpacking operator
}

ENUM_LAYOUT_TYPE = {
    'DUNGEON': 'DUNGEON',
    'MAZE': 'MAZE',
    'ROOM': 'ROOM',
    'ROOMS': 'ROOMS',
    'VILLAGE': 'VILLAGE'
    # ... tbd
}


def extend_initial_enums(extend_type=None):
    if extend_type == 'MAZE':
        apply_maze_enum_updates(GRID)


def update_enums(is_walled_type=False):
    carve_offset = 1 if is_walled_type else 2
    ENUM_LOCATION_IS_CARVEABLE.update({
        'E': [carve_offset, 0],
        'N': [0, -GRID.get('WIDTH') * carve_offset],
        'S': [0, GRID.get('WIDTH') * carve_offset],
        'W': [-carve_offset, 0],
    })
    _ENUM_DIR_CARDINAL.update({
        'N': [0, -GRID.get('WIDTH')],
        'S': [0, GRID.get('WIDTH')],
    })
    _ENUM_DIR_CORNER.update({
        'NE': [1, -GRID.get('WIDTH')],
        'NW': [-1, -GRID.get('WIDTH')],
        'SE': [1, GRID.get('WIDTH')],
        'SW': [-1, GRID.get('WIDTH')],
    })
    ENUM_DIR.update({
        'CARDINAL': _ENUM_DIR_CARDINAL,
        'DIAGONAL': _ENUM_DIR_CORNER,
        'SURROUNDING': _ENUM_DIR_CARDINAL | _ENUM_DIR_CORNER,  # `|` is merge (`|=` merges in  place w/o re-assigning
    })


ENUM_OPTION_TYPE = {
    'BOOL': 2,
    'DIR': {'CARDINAL': 4, 'SURROUNDING': 8},
}

def add_procedural_subparser_maze(proc_parsers):
    """Adds CLI options for procedurally generated maze"""
    procedural_parser_maze = proc_parsers.add_parser("maze", help="Generate Procedural Maze")
    procedural_parser_maze.add_argument(
        '--algo', '-a', action='store_true',
        help='TODO: update to allow more customized maze generation algorithm configuration')
    procedural_parser_maze.add_argument(
        '--anim', '-A', action='store_true',
        help='animate procedural build')
    procedural_parser_maze.add_argument(
        '--walled', '-w', action='store_true',
        help='render as walled procedural')

def add_procedural_subparsers(root_parser):
    """Adds CLI options for procedurally generated content: maze, room, rooms, square-diamond, ..."""
    # todo: [c]ave, [d]ungeon, [m]aze, [r]oom, [R]ooms, [v]illage'
    procedural_parsers = root_parser.add_subparsers(title="procedural generation", dest="procgen")
    add_procedural_subparser_maze(procedural_parsers)


# print("""interesting:
#     - py app.py 18 36 298608618 maze -Aw
#     - py app.py maze -w
#     - py app.py maze
#     - py app.py 12 12 12 maze -A
#     - 16 26 5810590
#     - 8 13 58105907967881684749
#     - 16 26 58
#     - 16 26 134269
#     - 20 40 17906106984432535371
#     - 20 40 48866109023011662405 <-- had a few edge cases
#     - 20 40 4886610902301166
#     - 20 40 58884455474897919654
#     - 8 12 13421342 -A <-- carved
#     - 8 12 13421342 -Aw < -- walled
#     - 20 40 588844554748979196545 -w
#     - 18 36 29860086412884897115 -Aw
#     - 18 36 298608618497115 -w <-- has '+'
#     - 18 36 98782528972936655916
#     - py app.py 15 12 77211838859715482 maze -wA
#     """)

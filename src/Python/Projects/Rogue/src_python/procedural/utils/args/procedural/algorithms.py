def add_procedural_subparser_diamond_square(proc_parsers):
    """Adds CLI options for procedurally generated maze"""
    procedural_parser_diamond_square = proc_parsers.add_parser("diamond-square", aliases=['DS'], help="Process Diamond Square Algorithm")
    procedural_parser_diamond_square.add_argument(
        '--range-output', '-r',
        metavar='Range of Final Values: float, float', type=float, nargs='*',
        default=[0, 10],
        help='[min, max) float specifying the range of final output values')
    procedural_parser_diamond_square.add_argument(
        '--jitter', '-j',
        metavar='Float of mutation multiplier: float, float', type=float,
        default=.85,
        help='float between 0-1 specifying the multiplier to subtract for each iteration. values closer to 0 result in smoother transitions')
    procedural_parser_diamond_square.add_argument(
        '--wrap', '-w', action='store_true',
        help='Wrap values to allow tiling?')

def add_procedural_algorithm_subparsers(procedural_parsers):
    """Adds CLI options for procedurally created algorithms:square-diamond, voronoi, wave function collapse, ..."""
    # todo: voronoi, wfc, etc'
    add_procedural_subparser_diamond_square(procedural_parsers)


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

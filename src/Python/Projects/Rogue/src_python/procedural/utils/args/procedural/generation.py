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

def add_procedural_generation_subparsers(procedural_parsers):
    """Adds CLI options for procedurally generated content: maze, room, rooms, square-diamond, ..."""
    # todo: [c]ave, [d]ungeon, [m]aze, [r]oom, [R]ooms, [v]illage'
    add_procedural_subparser_maze(procedural_parsers)

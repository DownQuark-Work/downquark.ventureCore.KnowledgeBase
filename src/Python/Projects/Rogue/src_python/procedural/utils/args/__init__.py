import argparse
from src_python.procedural.utils.args.procedural.generation import add_procedural_generation_subparsers
from src_python.procedural.utils.args.procedural.algorithms import add_procedural_algorithm_subparsers

"""Handle initial dimension &&|| seed configuration"""
parser = argparse.ArgumentParser(description='procedural configuration', prog="dq", usage="dq [options]")
parser.add_argument('dimensions', metavar='Dimensions: int int', type=int, nargs='*',
                    default=[8, 17],
                    help='1-2 integers (depending subparser_ for the width and height of the procedural')
parser.add_argument('seed', metavar='<seed>', type=int, nargs='?',
                    default=-1,
                    help='integer to seed the prng value')

procedural_parsers = parser.add_subparsers(title="procedural", dest="procgen")
add_procedural_generation_subparsers(procedural_parsers)
add_procedural_algorithm_subparsers(procedural_parsers)

def build_arg_parser():
    return parser.parse_args()

import argparse
from src_python.procedural.utils.args.procedural_generation import add_procedural_subparsers

"""Handle initial dimension &&|| seed configuration"""
parser = argparse.ArgumentParser(description='procedural configuration', prog="dq", usage="dq [options]")
parser.add_argument('dimensions', metavar='Dimensions: int int', type=int, nargs='*',
                    default=[8, 17],
                    help='2 integers for the width and height of the procedural')
parser.add_argument('seed', metavar='<seed>', type=int, nargs='?',
                    default=-1,
                    help='integer to seed the prng value')

add_procedural_subparsers(parser)

def build_arg_parser():
    return parser.parse_args()

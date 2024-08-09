"""Creates Psuedo Random Number and Handles Index Pointer"""
import secrets
from random import random, seed as rand_seed

from src_python.procedural.utils.const import GRID
from src_python.procedural.utils.const import PRNG as PRNG_CONST
from src_python.procedural.proseedural.decision import parse_value

initial_seed = -1


class PRNG:
    """Create Psuedo Random Number"""

    def __init__(self, set_seed):
        if set_seed < 0:
            self._seed = int(str(secrets.randbelow(10 ** 10)) + str(secrets.randbelow(10 ** 10)))
            self._initial_seed = self._seed
        else:
            self._seed = set_seed
            self._initial_seed = set_seed
        globals()['initial_seed'] = self._initial_seed
        self._rand_num = ''


    @property
    def seed(self):
        """_seed getter"""
        return self._seed

    @seed.setter
    def seed(self, value):
        self._seed = value

    @property
    def rand_num_len(self):
        return len(self._rand_num)

    @property
    def rand_num(self):
        """_rand_num getter"""
        return self._rand_num

    @rand_num.setter
    def rand_num(self, value):
        self._rand_num = value

    @rand_num.deleter
    def rand_num(self):
        del self._rand_num

    def create_prng(self):
        rand_seed(self.seed)
        seeded_rand = int(random()*(10**16))
        self._rand_num = self._rand_num + str(seeded_rand)
        if len(self._rand_num) < GRID.get('HEIGHT') * GRID.get('WIDTH'):
            self.seed = seeded_rand
            self.create_prng()

    def __repr__(self):
        return f"{self._rand_num}"


class Walker(PRNG):
    """Pointer to current parseable PRNG value"""

    def __init__(self, seeded=-1, auto_inc=True):
        super().__init__(seeded)
        self._pos = 0
        self._prng = 0
        self._auto_inc = auto_inc
        PRNG_CONST.update({'POINTER': self})

    def pos_val(self, opt_amt) -> int:
        """returns [0-opt_amt) based on pointer position"""
        return parse_value(opt_amt)

    @property
    def pos(self,):
        """gets value of prng at specified _pos index"""
        if self._prng == 0:  # if not set
            self._prng = f'{self.rand_num}'  # set once and convert to string
        if self._auto_inc:  # auto increment if applicable
            self._pos = self._pos + 1
        if self._pos >= self.rand_num_len:  # start over if @ end of prng
            self._pos = 0
        return int(self._prng[self._pos])

    @property
    def pos_index(self, ):
        """gets index without auto-increment"""
        return self._pos

    @pos_index.setter
    def pos_index(self, value):
        self._pos = value

    @pos_index.deleter
    def pos_index(self):
        del self._pos

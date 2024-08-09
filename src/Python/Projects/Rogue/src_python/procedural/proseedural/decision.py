import math

from src_python.procedural.utils.const import PRNG as PRNG_CONST

"""Returns _fair-ish_ weighted decision"""
prng_pos = None


def parse_value(opt_amt):
    """returns [0-opt_amt) based on pointer position"""
    #     # not completely fair in terms of values being selected.
    #     # But close enough for this use case
    if not globals()['prng_pos']:
        globals()['prng_pos'] = PRNG_CONST.get('POINTER')
    prng_position = globals()['prng_pos']
    pos_int = prng_position.pos
    # print('opt_amt', opt_amt)

    if opt_amt > 10:  # consider refactor for `divmod`
        divided_opt_amt_arr = []
        divided_opt_amt = opt_amt
        while divided_opt_amt > 10:
            cur_divided_opt_amt = divided_opt_amt / 10
            divided_opt_amt_arr.append(cur_divided_opt_amt)
            divided_opt_amt = cur_divided_opt_amt
        from_rng = 0
        for i in range(len(divided_opt_amt_arr)):
            pos_int = prng_position.pos
            from_rng += math.floor(pos_int*divided_opt_amt_arr[i])
        ret_val = from_rng
    else:
        ret_val = pos_int % opt_amt
    # print('pos_int', pos_int, prng_position.pos_index, ret_val)
    return ret_val


# class ProcDecision:
#     """Determines procedurally generated values"""
#     def __init__(self):
#         self._decisions = []
#
#     @property
#     def decisions(self):
#         """_seed getter"""
#         return self._decisions
#
#     @decisions.setter
#     def decisions(self, value):
#         self._decisions.append(value)

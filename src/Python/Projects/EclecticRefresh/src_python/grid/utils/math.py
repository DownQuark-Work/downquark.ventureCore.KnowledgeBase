def reduce(function, iterable, initializer=None):
    it = iter(iterable)
    if initializer is None:
        value = next(it)
    else:
        value = initializer
    for element in it:
        value = function(value, element)
    return value


def array_set(unset_list):
    list_set = set(unset_list)
    return (list(list_set))

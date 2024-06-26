from src_python.procedural.utils.const import GRID


def with_config_grid(grid_key=None):
    def with_grid_hoc(fnc):
        def with_grid_decorator(*args, **kwargs):
            fnc(GRID.get(grid_key) if grid_key else GRID, *args, **kwargs)  # Call the actual function being decorated
        return with_grid_decorator
    return with_grid_hoc  # Return the higher order component


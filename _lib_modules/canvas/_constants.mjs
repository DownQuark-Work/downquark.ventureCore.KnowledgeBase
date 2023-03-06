// _dq-lib grid constants are basic examples and may freely be overwritten/extended per instance.
export const GRID = {
  CARVED: {
    CELL_TYPE: new Proxy.Enum('BORDER|UNCARVED|UNCHECKED|EGRESS|COORIDOR|WALL',-3),
    EGRESS_TYPE: new Proxy.Enum('ENTER|EXIT|PORTAL|EVENT'),
  },
  CELLULAR: {},
}
/**
 *EVENT EGRESS_TYPE is a catchaall:
 *  accepting a sidequest, winning/losing boss battle,
 *  tornado got ya after a brazilian butterfly's wings flapped, etc
 */
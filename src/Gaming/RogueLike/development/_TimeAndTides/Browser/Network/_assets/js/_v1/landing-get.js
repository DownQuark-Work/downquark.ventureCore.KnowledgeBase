// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const SHOW_ANIMATION = 0;
const CELL_DIRECTIONS = {
    BOTTOM: 0,
    LEFT: 1,
    RIGHT: 2,
    TOP: 3
};
const CELL_DIRECTIONS_MAP = [
    'BOTTOM',
    'LEFT',
    'RIGHT',
    'TOP', 
];
const RENDER_MAZE_AS = {
    PASSAGE: 'RENDER_MAZE_AS.PASSAGE',
    WALLED: 'RENDER_MAZE_AS.WALLED',
    BACKTRACKER: 'RENDER_MAZE.WITH_BACKTRACKER',
    HUNT_AND_KILL: 'RENDER_MAZE.WITH_HUNT_AND_KILL',
    PRIM: 'RENDER_MAZE.WITH_PRIM',
    SIDEWINDER: 'RENDER_MAZE.WITH_SIDEWINDER'
};
const CELL_STATE = {
    COMMON: {
        NON_CONSIDERED: 0,
        CONSIDER: -1.1,
        CREATED: -1.2,
        CURRENT: -1.3
    },
    EGGRESS: {
        ENTER: -2.1,
        EXIT: -2.2
    }
};
CELL_STATE[RENDER_MAZE_AS.PASSAGE] = {
    CONCRETE: 0,
    UNCARVED: 1,
    CARVED: 1.1,
    IN_PATH: 2.1
};
CELL_STATE[RENDER_MAZE_AS.WALLED] = CELL_DIRECTIONS;
const ACTIVE_WALLS = [
    CELL_STATE.COMMON.CREATED,
    0,
    0,
    0
];
const SETTINGS = {
    ACTIVE_WALLS,
    CELL_STATE,
    GRID_HEIGHT: 13,
    GRID_WIDTH: 13,
    RENDER_MAZE_AS
};
const renderDefaultGrid = (Grid2)=>{
    Grid2.forEach((row)=>{
        const graphics = row.map((i)=>i.toString() === '#' ? '#' : /⊡|^[^0]+$/g.test(i.toString()) ? '🀫' : ' '
        );
        const gRow = [
            '|',
            ...graphics,
            '|'
        ];
        console.log(...gRow);
    });
};
const renderWalledGrid = (Grid3)=>{
    Grid3.forEach((row)=>{
        const graphics = row.map((i)=>i.toString() === '#' ? '#' : /⊡|^1$/g.test(i.toString()) ? '🀫' : ' '
        );
        const gRow = [
            '|',
            ...graphics,
            '|'
        ];
        console.log(...gRow);
    });
};
const renderGrid = (Grid4, opts = {}, _DEBUG = false)=>{
    _DEBUG && console.log('opts', opts);
    !_DEBUG && console.clear();
    const topBorder = [
        ...Array(Grid4[0].length + 2).fill('_')
    ], bottomBorder = [
        ...Array(Grid4[0].length + 2).fill('—')
    ];
    console.log(...topBorder);
    switch(opts.type){
        case RENDER_MAZE_AS.WALLED:
            renderWalledGrid(Grid4);
            break;
        default:
            renderDefaultGrid(Grid4);
    }
    console.log(...bottomBorder);
};
const FloodFillReturnObject = {
    RoomAmount: [],
    RoomEgress: {}
};
const fill = (g, r, c, n)=>{
    if (c < 0 || r < 0 || c > g[0].length - 1 || r > g.length - 1) return;
    const cur = g[r][c], ff = n + '⊡' + cur;
    if (/⊡/g.test(cur)) return;
    if (parseInt(cur, 10) < 1) return;
    g[r][c] = ff;
    fill(g, r - 1, c, n);
    fill(g, r + 1, c, n);
    fill(g, r, c - 1, n);
    fill(g, r, c + 1, n);
};
const flood = (grd1)=>{
    let curRoom = 0;
    for(let row = 0; row < grd1.length; row++){
        for(let column = 0; column < grd1[row].length; column++){
            const cur = grd1[row][column];
            if (!/⊡/g.test(cur) && parseInt(cur, 10) > 0) {
                fill(grd1, row, column, curRoom);
                if (FloodFillReturnObject?.RoomEgress) FloodFillReturnObject.RoomEgress[curRoom] = [
                    row,
                    column
                ];
                curRoom++;
            }
        }
    }
    FloodFillReturnObject.RoomAmount?.push(curRoom);
    return grd1;
};
const returnFloodFilled = (fFG)=>{
    FloodFillReturnObject.FloodFilledAutomata = fFG;
    false && renderGrid(fFG[0]);
};
const applyFloodFill = (grids, seedProp, verifySeed)=>{
    FloodFillReturnObject.seedArg = seedProp;
    FloodFillReturnObject.verifySeed = verifySeed;
    const floodFillGrids = grids.map((grid)=>flood(grid)
    );
    returnFloodFilled(floodFillGrids);
    typeof Deno !== 'undefined' && console.log(JSON.stringify(FloodFillReturnObject));
    return FloodFillReturnObject;
};
if (typeof Deno !== 'undefined' && Deno?.args.length) {
    const denoFloodFillProps = JSON.parse(Deno.args[0]);
    denoFloodFillProps && applyFloodFill(denoFloodFillProps.CellularAutomata, denoFloodFillProps.seedArg, denoFloodFillProps.verifySeed);
}
const CorridorReturnObject = {
    CorridorAutomata: []
};
const FloodFillArguments = {
    seedArg: 0,
    verifySeed: 0,
    RoomAmount: [
        0
    ],
    RoomEgress: {},
    FloodFilledAutomata: [
        [
            [
                'NOT_YET_SET'
            ]
        ]
    ]
};
let corridorMapIndexes = [];
const determineAccessPoints = ()=>{
    CorridorReturnObject.seedArg = FloodFillArguments.seedArg;
    CorridorReturnObject.verifySeed = FloodFillArguments.verifySeed;
    CorridorReturnObject.CorridorAutomata = [
        ...FloodFillArguments.FloodFilledAutomata, 
    ];
    FloodFillArguments.RoomAmount.forEach((rm1)=>{
        let shuffleIndexes = FloodFillArguments.verifySeed.toString(2) + '';
        while(shuffleIndexes.split('').length < CorridorReturnObject.CorridorAutomata[0].length){
            shuffleIndexes += '' + shuffleIndexes;
        }
        shuffleIndexes = shuffleIndexes.slice(0, CorridorReturnObject.CorridorAutomata[0].length);
        const shuffleIndexedArr = shuffleIndexes.split('');
        const shuffleArray = (arr)=>{
            for(let i = arr.length - 1; i > 0; i--){
                const j = parseInt(shuffleIndexedArr?.shift() || '0', 10);
                [arr[i], arr[j]] = [
                    arr[j],
                    arr[i]
                ];
            }
            return arr;
        };
        let toShuffle = [], hasShuffled = [];
        corridorMapIndexes = [];
        toShuffle = [
            ...Array(Math.ceil(rm1 / 2)).keys()
        ];
        hasShuffled = shuffleArray([
            ...Array(Math.floor(rm1 / 2)).keys()
        ].map((i)=>i + toShuffle.length
        ));
        hasShuffled = shuffleArray([
            ...hasShuffled
        ]);
        toShuffle.forEach((rm, indx)=>{
            if (rm === hasShuffled[indx]) indx = indx === 0 ? 1 : 0;
            const crdr = hasShuffled[indx] || hasShuffled[0];
            corridorMapIndexes.push([
                rm,
                crdr
            ]);
        });
    });
};
const createBridge = (brdg)=>{
    const [s, e] = brdg;
    const deltaRow = e[0] - s[0], deltaCol = e[1] - s[1];
    function bridgeRows() {
        for(let i = 0; i <= Math.abs(deltaRow); i++){
            const keyCell = s[0] + i * Math.max(Math.min(deltaRow, 1), -1);
            if (keyCell < CorridorReturnObject.CorridorAutomata[0].length && !/⊡/g.test(CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]]) && CorridorReturnObject.CorridorAutomata[0][keyCell] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1] - 1] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1] - 1] !== '#' && CorridorReturnObject.CorridorAutomata[0][keyCell] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1] + 1] && CorridorReturnObject.CorridorAutomata[0][keyCell][s[1] + 1] !== '#') {
                CorridorReturnObject.CorridorAutomata[0][keyCell][s[1]] = '#';
            }
        }
    }
    function bridgeColumns() {
        for(let i = 0; i <= Math.abs(deltaCol); i++){
            const keyCell = s[1] + i * Math.max(Math.min(deltaCol, 1), -1);
            if (keyCell < CorridorReturnObject.CorridorAutomata[0][0].length && !/⊡/g.test(CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell]) && CorridorReturnObject.CorridorAutomata[0][e[0] - 1] && CorridorReturnObject.CorridorAutomata[0][e[0] - 1][keyCell] && CorridorReturnObject.CorridorAutomata[0][e[0] - 1][keyCell] !== '#' && CorridorReturnObject.CorridorAutomata[0][e[0] + 1] && CorridorReturnObject.CorridorAutomata[0][e[0] + 1][keyCell] && CorridorReturnObject.CorridorAutomata[0][e[0] + 1][keyCell] !== '#') {
                CorridorReturnObject.CorridorAutomata[0][e[0]][keyCell] = '#';
            }
        }
    }
    bridgeRows();
    bridgeColumns();
};
const initCreation = ()=>{
    determineAccessPoints();
    for(let i = 0; i < corridorMapIndexes.length; i++){
        const bridgeSpan = [
            FloodFillArguments.RoomEgress[corridorMapIndexes[i][0]],
            FloodFillArguments.RoomEgress[corridorMapIndexes[i][1]],
            i
        ];
        createBridge(bridgeSpan);
    }
    false && renderGrid(CorridorReturnObject.CorridorAutomata[0]);
    typeof Deno !== 'undefined' && console.log(JSON.stringify(CorridorReturnObject));
};
const createCorridors = (browserArgs)=>{
    Object.entries(browserArgs).forEach((entry)=>FloodFillArguments[entry[0]] = entry[1]
    );
    FloodFillArguments && initCreation();
    return CorridorReturnObject;
};
if (typeof Deno !== 'undefined' && Deno?.args.length) {
    const denoArgs = JSON.parse(Deno.args[0]);
    Object.entries(denoArgs).forEach((entry)=>FloodFillArguments[entry[0]] = entry[1]
    );
    FloodFillArguments && initCreation();
}
const SURVIVING_CELL_RANGE = [
    3,
    4,
    5,
    6,
    7,
    8
];
const TO_LIFE_RANGE = [
    6,
    7,
    8
];
const RENDER_AS = {
    BINARY: (state)=>state > 0 ? '1' : '0'
    ,
    AGGREGATE: (state)=>'' + state
    ,
    CHAR: (state, on, off)=>state > 0 ? on : off
};
const SETTINGS1 = {
    GRID_HEIGHT: 10,
    GRID_WIDTH: 10,
    ITERATIONS: 20,
    RENDER_AGGREGATE_DELTA: true,
    RENDER_AS,
    RETURN_ALL_STEPS: false,
    SURVIVING_CELL_RANGE,
    TO_LIFE_RANGE
};
const PRNG = function(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) {
        this._seed += 2147483646;
    }
};
PRNG.prototype.next = function(a, b) {
    this._seed = this._seed * 16807 % 2147483647;
    if (arguments.length === 0) {
        return this._seed / 2147483647;
    } else if (arguments.length === 1) {
        return this._seed / 2147483647 * a;
    } else {
        return this._seed / 2147483647 * (b - a) + a;
    }
};
let verifiedSeed = 0, seededArr = [], parsedSeed = [];
const parseSeed = (preParsedSeed, seedLength)=>{
    const seed = new PRNG(preParsedSeed);
    let seededStr = '';
    while(seededStr.length < seedLength)seededStr += String(seed.next(10, 100)).replace(/[^0-9]/g, '');
    seededArr = seededStr.slice(0, seedLength).split('');
    verifiedSeed = seededArr.reduce((a, c)=>a + parseInt(c, 10)
    , 0);
    parsedSeed = seededArr.map((str)=>parseInt(str, 10)
    );
    return seededArr;
};
const parsedVerifiedValue = ()=>verifiedSeed
;
const seedPointer = (setter)=>{
    if (setter) {
        seedPointer.pointerValue = setter;
    }
    return parsedSeed[seedPointer.pointerValue];
};
seedPointer.inc = ()=>{
    if (++seedPointer.pointerValue >= parsedSeed.length) seedPointer.pointerValue = 0;
    return parsedSeed[seedPointer.pointerValue];
};
seedPointer.pointerValue = 0;
class Cell {
    _amtDied = 0;
    _amtLived = 0;
    stateCur;
    _stateNext = 'UNSET';
    x;
    y;
    constructor(x, y, a){
        this.x = x;
        this.y = y;
        this.stateCur = a;
    }
    storeNextState(survived = false) {
        survived ? SETTINGS1.RENDER_AGGREGATE_DELTA ? this._stateNext = ++this._amtLived + this._amtDied : this._stateNext = ++this._amtLived : SETTINGS1.RENDER_AGGREGATE_DELTA ? this._stateNext = this._amtLived + --this._amtDied : this._stateNext = --this._amtDied;
    }
    applyNextState() {
        if (typeof this._stateNext === 'number') this.stateCur = this._stateNext;
        this._stateNext = 'UNSET';
    }
}
class Grid {
    comparisonGrid = [
        [
            'GRID_INIT'
        ]
    ];
    verifySeed = 0;
    _gridmap = {};
    h;
    w;
    constructor(h, w){
        this.h = h;
        this.w = w;
    }
    init(seed, oGASI) {
        const _seed = [
            ...seed
        ], _onGridAndSeedInit = oGASI;
        for(let gX = 0; gX < this.w; gX++){
            for(let gY = 0; gY < this.h; gY++){
                const cellInitValue = _seed[0] ? _seed.shift() : Math.round(Math.random()).toString();
                this._gridmap[`${gX}|${gY}`] = cellInitValue ? new Cell(gX, gY, parseInt(cellInitValue, 10) % 2) : new Cell(gX, gY, 0);
            }
        }
        this.comparisonGrid = [
            []
        ];
        _onGridAndSeedInit();
    }
    cycleLife() {
        Object.keys(this._gridmap).forEach((cell)=>{
            let livingNeighbors = 0;
            const curCellPos = cell.split('|').map((c)=>parseInt(c, 10)
            ), curCell = this._gridmap[curCellPos[0] + '|' + curCellPos[1]];
            for(let yy = -1; yy < 2; yy++){
                for(let xx = -1; xx < 2; xx++){
                    const gmX = curCellPos[0] + xx;
                    const gmY = curCellPos[1] + yy;
                    if (!(gmX < 0 || gmY < 0 || gmX > this.w - 1 || gmY > this.h - 1 || gmX === curCellPos[0] && gmY === curCellPos[1])) {
                        livingNeighbors += Math.max(Math.min(this._gridmap[gmX + '|' + gmY].stateCur, 1), 0);
                    }
                }
            }
            if (curCell.stateCur > 0) {
                if (SETTINGS1.SURVIVING_CELL_RANGE.includes(livingNeighbors)) {
                    curCell.storeNextState(true);
                } else {
                    curCell.storeNextState();
                }
            } else {
                if (SETTINGS1.TO_LIFE_RANGE.includes(livingNeighbors)) {
                    curCell.storeNextState(true);
                } else {
                    curCell.storeNextState();
                }
            }
        });
        Object.values(this._gridmap).forEach((cell)=>cell.applyNextState()
        );
    }
    finalizeGrid(golArr) {
        let printRow = [];
        const returnGrid = [];
        for(let gY = 0; gY < this.h; gY++){
            for(let gX = 0; gX < this.w; gX++){
                const renderChar = SETTINGS1.RENDER_AS.BINARY(this._gridmap[`${gX}|${gY}`].stateCur);
                printRow.push(renderChar);
            }
            returnGrid.push([
                ...printRow
            ]);
            printRow = [];
        }
        if (JSON.stringify(this.comparisonGrid).replace(/^-.*/g, '0').replace(/[1-9]+/g, '1') === JSON.stringify(returnGrid).replace(/^-.*/g, '0').replace(/[1-9]+/g, '1')) {
            return this.comparisonGrid = [
                [
                    'REPEATING_PATTERN'
                ]
            ];
        }
        this.comparisonGrid = returnGrid;
        golArr ? golArr.push(returnGrid) : renderGrid(returnGrid);
    }
}
const parseSeedArg = (seedArg1)=>{
    cellularAutomataReturnObject.seedArg = seedArg1;
    const seed = parseSeed(seedArg1, gridW * gridH);
    return seed;
};
const cellularAutomataReturnObject = {};
let curIt = 0;
const onGridAndSeedInit = ()=>{
    if (iterationsRemaining < 1) {
        const itInterval = setInterval(()=>{
            if (grd.comparisonGrid[0][0] === 'REPEATING_PATTERN') {
                clearInterval(itInterval);
                console.log('final');
                return;
            }
            grd.cycleLife();
            grd.finalizeGrid();
            console.log(`::iterations run:: ${++curIt}`);
        }, 300);
    } else {
        const CellularAutomataSteps = [];
        let CellularAutomata = [];
        while(grd.comparisonGrid[0][0] !== 'REPEATING_PATTERN' && iterationsRemaining){
            grd.cycleLife();
            grd.finalizeGrid(CellularAutomataSteps);
            iterationsRemaining--;
            CellularAutomata = [
                CellularAutomataSteps[CellularAutomataSteps.length - 1]
            ];
            ++curIt;
        }
        CellularAutomata = SETTINGS1.RETURN_ALL_STEPS ? CellularAutomataSteps : CellularAutomata;
        cellularAutomataReturnObject.CellularAutomata = CellularAutomata;
        cellularAutomataReturnObject.verifySeed = parsedVerifiedValue();
        cellularAutomataReturnObject.iterations_run = curIt;
        typeof Deno !== 'undefined' && console.log(JSON.stringify(cellularAutomataReturnObject));
    }
};
let gridW, gridH, seedArg, iterationsRemaining = 0, grd;
const initCellularAutomata = (props)=>{
    false && console.log('props', props);
    gridW = props.gw || SETTINGS1.GRID_WIDTH, gridH = props.gh || SETTINGS1.GRID_HEIGHT, seedArg = props.sa ? parseSeedArg(props.sa) : parseSeedArg(new Date().getTime());
    iterationsRemaining = props.ir || SETTINGS1.ITERATIONS;
    grd = new Grid(gridH, gridW);
    grd.init(seedArg, onGridAndSeedInit);
    return cellularAutomataReturnObject;
};
if (typeof Deno !== 'undefined' && Deno?.args.length) {
    const gw = Deno.args?.[0] && parseInt(Deno.args[0], 10) || 0, gh = Deno.args?.[1] && parseInt(Deno.args[1], 10) || 0, sa = Deno.args?.[2] && parseInt(Deno.args[2], 10) || 0, ir = Deno.args?.[3] && parseInt(Deno.args[3], 10) || 0;
    initCellularAutomata({
        gw,
        gh,
        sa,
        ir
    });
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
const { hasOwn  } = Object;
function get(obj, key) {
    if (hasOwn(obj, key)) {
        return obj[key];
    }
}
function getForce(obj, key) {
    const v = get(obj, key);
    assert(v != null);
    return v;
}
function isNumber(x) {
    if (typeof x === "number") return true;
    if (/^0x[0-9a-f]+$/i.test(String(x))) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
}
function hasKey(obj, keys) {
    let o = obj;
    keys.slice(0, -1).forEach((key)=>{
        o = get(o, key) ?? {};
    });
    const key1 = keys[keys.length - 1];
    return key1 in o;
}
function parse(args, { "--": doubleDash = false , alias: alias3 = {} , boolean: __boolean = false , default: defaults = {} , stopEarly =false , string =[] , unknown =(i)=>i
  } = {}) {
    const flags = {
        bools: {},
        strings: {},
        unknownFn: unknown,
        allBools: false
    };
    if (__boolean !== undefined) {
        if (typeof __boolean === "boolean") {
            flags.allBools = !!__boolean;
        } else {
            const booleanArgs = typeof __boolean === "string" ? [
                __boolean
            ] : __boolean;
            for (const key of booleanArgs.filter(Boolean)){
                flags.bools[key] = true;
            }
        }
    }
    const aliases = {};
    if (alias3 !== undefined) {
        for(const key in alias3){
            const val = getForce(alias3, key);
            if (typeof val === "string") {
                aliases[key] = [
                    val
                ];
            } else {
                aliases[key] = val;
            }
            for (const alias1 of getForce(aliases, key)){
                aliases[alias1] = [
                    key
                ].concat(aliases[key].filter((y)=>alias1 !== y
                ));
            }
        }
    }
    if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [
            string
        ] : string;
        for (const key of stringArgs.filter(Boolean)){
            flags.strings[key] = true;
            const alias = get(aliases, key);
            if (alias) {
                for (const al of alias){
                    flags.strings[al] = true;
                }
            }
        }
    }
    const argv = {
        _: []
    };
    function argDefined(key, arg) {
        return flags.allBools && /^--[^=]+$/.test(arg) || get(flags.bools, key) || !!get(flags.strings, key) || !!get(aliases, key);
    }
    function setKey(obj, keys, value) {
        let o = obj;
        keys.slice(0, -1).forEach(function(key) {
            if (get(o, key) === undefined) {
                o[key] = {};
            }
            o = get(o, key);
        });
        const key4 = keys[keys.length - 1];
        if (get(o, key4) === undefined || get(flags.bools, key4) || typeof get(o, key4) === "boolean") {
            o[key4] = value;
        } else if (Array.isArray(get(o, key4))) {
            o[key4].push(value);
        } else {
            o[key4] = [
                get(o, key4),
                value
            ];
        }
    }
    function setArg(key, val, arg = undefined) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg, key, val) === false) return;
        }
        const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
        setKey(argv, key.split("."), value);
        const alias = get(aliases, key);
        if (alias) {
            for (const x of alias){
                setKey(argv, x.split("."), value);
            }
        }
    }
    function aliasIsBoolean(key) {
        return getForce(aliases, key).some((x)=>typeof get(flags.bools, x) === "boolean"
        );
    }
    for (const key3 of Object.keys(flags.bools)){
        setArg(key3, defaults[key3] === undefined ? false : defaults[key3]);
    }
    let notFlags = [];
    if (args.includes("--")) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
    }
    for(let i = 0; i < args.length; i++){
        const arg = args[i];
        if (/^--.+=/.test(arg)) {
            const m = arg.match(/^--([^=]+)=(.*)$/s);
            assert(m != null);
            const [, key, value] = m;
            if (flags.bools[key]) {
                const booleanValue = value !== "false";
                setArg(key, booleanValue, arg);
            } else {
                setArg(key, value, arg);
            }
        } else if (/^--no-.+/.test(arg)) {
            const m = arg.match(/^--no-(.+)/);
            assert(m != null);
            setArg(m[1], false, arg);
        } else if (/^--.+/.test(arg)) {
            const m = arg.match(/^--(.+)/);
            assert(m != null);
            const [, key] = m;
            const next = args[i + 1];
            if (next !== undefined && !/^-/.test(next) && !get(flags.bools, key) && !flags.allBools && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            } else if (/^(true|false)$/.test(next)) {
                setArg(key, next === "true", arg);
                i++;
            } else {
                setArg(key, get(flags.strings, key) ? "" : true, arg);
            }
        } else if (/^-[^-]+/.test(arg)) {
            const letters = arg.slice(1, -1).split("");
            let broken = false;
            for(let j = 0; j < letters.length; j++){
                const next = arg.slice(j + 2);
                if (next === "-") {
                    setArg(letters[j], next, arg);
                    continue;
                }
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split(/=(.+)/)[1], arg);
                    broken = true;
                    break;
                }
                if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j + 2), arg);
                    broken = true;
                    break;
                } else {
                    setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                }
            }
            const [key] = arg.slice(-1);
            if (!broken && key !== "-") {
                if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !get(flags.bools, key) && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i + 1], arg);
                    i++;
                } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                    setArg(key, args[i + 1] === "true", arg);
                    i++;
                } else {
                    setArg(key, get(flags.strings, key) ? "" : true, arg);
                }
            }
        } else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
            }
            if (stopEarly) {
                argv._.push(...args.slice(i + 1));
                break;
            }
        }
    }
    for (const key2 of Object.keys(defaults)){
        if (!hasKey(argv, key2.split("."))) {
            setKey(argv, key2.split("."), defaults[key2]);
            if (aliases[key2]) {
                for (const x of aliases[key2]){
                    setKey(argv, x.split("."), defaults[key2]);
                }
            }
        }
    }
    if (doubleDash) {
        argv["--"] = [];
        for (const key of notFlags){
            argv["--"].push(key);
        }
    } else {
        for (const key of notFlags){
            argv._.push(key);
        }
    }
    return argv;
}
const mazeReturnObject = {
    Algorithm: SETTINGS.RENDER_MAZE_AS.BACKTRACKER,
    AnimationDuration: 0,
    Grid: {
        flatGrid: [
            [
                0
            ]
        ]
    },
    Type: SETTINGS.RENDER_MAZE_AS.PASSAGE,
    Seed: 0
};
class Cell1 {
    _state;
    column;
    row;
    get state() {
        return this._state;
    }
    set state(s) {
        this._state = s;
    }
    constructor(row, column, state = SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].CREATED){
        this._state = state;
        this.column = column;
        this.row = row;
    }
}
class Grid1 {
    amtColumn;
    amtRow;
    _flatGrid = [];
    #grid;
    get flatGrid() {
        return this._flatGrid;
    }
    constructor(amtColumn, amtRow){
        if (mazeReturnObject.Algorithm === SETTINGS.RENDER_MAZE_AS.SIDEWINDER) {
            this.amtColumn = amtColumn;
            this.amtRow = amtRow % 2 === 0 ? amtRow : amtRow + 1;
        } else {
            this.amtColumn = amtColumn % 2 === 0 ? amtColumn + 1 : amtColumn;
            this.amtRow = amtRow % 2 === 0 ? amtRow + 1 : amtRow;
        }
        this.#grid = [];
        this._flatGrid = [];
        this.constructGrid();
    }
    constructCell = (curRow, curCol)=>{
        return mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.WALLED ? new Cell1(curRow, curCol, SETTINGS.ACTIVE_WALLS) : new Cell1(curRow, curCol, curRow % 2 === 0 ? SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED : curCol % 2 !== 0 ? SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].UNCARVED : SETTINGS.CELL_STATE.COMMON.CREATED);
    };
    createGridLoop = ()=>{
        for(let curRow = 0; curRow < this.amtRow; curRow++){
            const c = [], f = [];
            for(let curCol = 0; curCol < this.amtColumn; curCol++){
                const cell = this.constructCell(curRow, curCol);
                c.push(cell);
                f.push(cell.state);
            }
            this.#grid.push(c);
            this._flatGrid.push(f);
        }
    };
    createGridFlood = ()=>{
        const initFill = mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.WALLED ? [
            0,
            0,
            0,
            0
        ] : SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED;
        const arr = Array.from(Array(this.amtRow), ()=>new Array(this.amtColumn).fill(initFill)
        );
        if (mazeReturnObject.Algorithm === SETTINGS.RENDER_MAZE_AS.SIDEWINDER) {
            initFill === SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED ? arr[0] = new Array(this.amtColumn).fill(SETTINGS.CELL_STATE[SETTINGS.RENDER_MAZE_AS.PASSAGE].IN_PATH) : arr[0] = new Array(this.amtColumn).fill([
                0,
                1,
                1,
                1
            ]);
            arr[0][0] = SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED;
            arr[0][this.amtColumn - 1] = SETTINGS.CELL_STATE.COMMON.NON_CONSIDERED;
        }
        this._flatGrid = arr;
    };
    constructGrid = ()=>{
        switch(mazeReturnObject.Algorithm){
            case SETTINGS.RENDER_MAZE_AS.SIDEWINDER:
                this.createGridFlood();
                break;
            default:
                this.createGridLoop();
        }
        0 && console.log('this.#grid', this.#grid);
    };
}
const init = (rowAmt, colAmt, mazeType, seedArg1 = new Date().getTime())=>{
    mazeReturnObject.Seed = seedArg1;
    if (mazeType === SETTINGS.RENDER_MAZE_AS.WALLED) mazeReturnObject.Type = SETTINGS.RENDER_MAZE_AS.WALLED;
    mazeReturnObject.Grid = new Grid1(colAmt, rowAmt);
    if (typeof Deno === 'undefined') return mazeReturnObject;
    0 && mazeReturnObject.Type === SETTINGS.RENDER_MAZE_AS.PASSAGE && (mazeReturnObject.Algorithm === SETTINGS.RENDER_MAZE_AS.BACKTRACKER || mazeReturnObject.Algorithm === SETTINGS.RENDER_MAZE_AS.PRIM) && renderGrid(mazeReturnObject.Grid.flatGrid);
    console.log(JSON.stringify(mazeReturnObject));
    0 && console.log('DEBUG :: Maze/_base.ts is in DEBUG mode - this may cause errors');
    return mazeReturnObject;
};
if (typeof Deno !== 'undefined') {
    const parsedArgs = parse(Deno.args);
    const { r: row = 13 , c: col = 17 , s: seed = new Date().getTime() , anim =0 , hak =false , prim =false , sdwndr =false , walled =false  } = parsedArgs;
    mazeReturnObject.AnimationDuration = anim ? typeof anim === 'number' ? Math.min(Math.max(100, anim), 500) : 225 : 0;
    mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.BACKTRACKER;
    if (hak) {
        mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.HUNT_AND_KILL;
    }
    if (prim) {
        mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.PRIM;
    }
    if (sdwndr) {
        mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.SIDEWINDER;
    }
    init(row, col, walled && SETTINGS.RENDER_MAZE_AS.WALLED, seed);
}
const setMazeProps = (c = 0, r = 0, s = 0, a = '', t = '')=>{
    mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.BACKTRACKER;
    if (a === SETTINGS.RENDER_MAZE_AS.HUNT_AND_KILL) {
        mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.HUNT_AND_KILL;
    }
    if (a === SETTINGS.RENDER_MAZE_AS.PRIM) {
        mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.PRIM;
    }
    if (a === SETTINGS.RENDER_MAZE_AS.SIDEWINDER) {
        mazeReturnObject.Algorithm = SETTINGS.RENDER_MAZE_AS.SIDEWINDER;
    }
    return init(r, c, t, s);
};
const renderGridPassage = (Grid5)=>{
    !0 && console.clear();
    const topBorder = [
        ...Array(Grid5[0].length + 2).fill('_')
    ], bottomBorder = [
        ...Array(Grid5[0].length + 2).fill('—')
    ];
    console.log(...topBorder);
    Grid5.forEach((row)=>{
        const graphics = row.map((i)=>{
            switch(i){
                case CELL_STATE[RENDER_MAZE_AS.PASSAGE].CARVED:
                case CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED:
                    return '🀫';
                case CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH:
                    return '◘';
                case CELL_STATE.COMMON.CONSIDER:
                    return '#';
                case CELL_STATE.COMMON.CURRENT:
                    return '○';
                case CELL_STATE.EGGRESS.ENTER:
                    return 'E';
                case CELL_STATE.EGGRESS.EXIT:
                    return 'X';
                default:
                    return ' ';
            }
        });
        const gRow = [
            '|',
            ...graphics,
            '|'
        ];
        console.log(...gRow);
    });
    console.log(...bottomBorder);
};
const createEgress = (RenderType, { Grid: Grid6 , Maze: Maze2 = [
    [
        0
    ]
] , seedPointer: seedPointer1  })=>{
    const colAmt = Grid6.amtColumn, rowAmt = Grid6.amtRow, restraintColAmt = colAmt - Math.floor(colAmt / 2.1), restraintRowAmt = rowAmt - Math.floor(rowAmt / 2.1), denomCol = 10 / colAmt, denomRow = 10 / rowAmt, denomRestraintCol = 10 / restraintColAmt, denomRestraintRow = 10 / restraintRowAmt, mazeBounds = {
        BOTTOM: rowAmt - 1,
        LEFT: 0,
        RIGHT: colAmt - 1,
        TOP: 0
    };
    while(seedPointer1() > 7){
        seedPointer1.inc();
    }
    const entWall = CELL_DIRECTIONS_MAP[seedPointer1() % 4];
    seedPointer1.inc();
    const exWall = CELL_DIRECTIONS_MAP[seedPointer1() % 4] === entWall ? CELL_DIRECTIONS_MAP[(seedPointer1() + 1) % 4] : CELL_DIRECTIONS_MAP[seedPointer1() % 4];
    seedPointer1.inc();
    if (RenderType === RENDER_MAZE_AS.BACKTRACKER || RenderType === RENDER_MAZE_AS.HUNT_AND_KILL || RenderType === RENDER_MAZE_AS.PRIM) {
        let entLoc = entWall.charAt(entWall.length - 1) === 'T' ? Math.floor(seedPointer1() / denomRow) : Math.floor(seedPointer1() / denomCol);
        if (entLoc % 2 === 0) {
            entLoc = Math.max(entLoc--, 1);
        }
        seedPointer1.inc();
        const exitConstraints = exWall.charAt(exWall.length - 1) !== entWall.charAt(entWall.length - 1) && exWall.charAt(1) !== entWall.charAt(1) ? exWall.charAt(exWall.length - 1) === 'T' ? -denomRestraintRow : -denomRestraintCol : exWall.charAt(exWall.length - 1) === 'T' ? denomRow : denomCol;
        let exLoc = exitConstraints < 0 ? Math.floor(seedPointer1() / Math.abs(exitConstraints) + Math.floor(Math.min(restraintColAmt, restraintRowAmt) / 2)) : Math.floor(seedPointer1() / exitConstraints);
        if (exLoc % 2 === 0) {
            Math.max(exLoc--, 1);
        }
        const entPt = entWall.charAt(entWall.length - 1) === 'T' ? [
            entLoc,
            mazeBounds[entWall]
        ] : [
            mazeBounds[entWall],
            entLoc
        ];
        const exPt = exWall.charAt(exWall.length - 1) === 'T' ? [
            exLoc,
            mazeBounds[exWall]
        ] : [
            mazeBounds[exWall],
            exLoc
        ];
        return {
            Enter: entPt,
            Exit: exPt
        };
    }
    if (RenderType === RENDER_MAZE_AS.SIDEWINDER) {
        const getLocation = (wall)=>{
            seedPointer1.inc();
            const initialLoc = wall.charAt(wall.length - 1) === 'T' ? Math.min(Math.max(Math.round(seedPointer1() / denomCol) + 1, 1), colAmt - 1) : Math.min(Math.max(Math.round(seedPointer1() / denomRow) + 1, 1), rowAmt - 1);
            let colCheck = colAmt - 2, rowCheck = 1;
            switch(wall){
                case 'LEFT':
                    colCheck = 1;
                case 'RIGHT':
                    rowCheck = initialLoc;
                    while(rowCheck && Maze2[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH)rowCheck--;
                    if (!rowCheck) {
                        while(rowCheck < rowAmt - 1 && Maze2[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH)rowCheck++;
                    }
                    return [
                        rowCheck,
                        colCheck === 1 ? 0 : colAmt - 1
                    ];
                case 'BOTTOM':
                    rowCheck = rowAmt - 2;
                case 'TOP':
                default:
                    colCheck = initialLoc;
                    while(colCheck && Maze2[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH)colCheck--;
                    if (!colCheck) {
                        while(colCheck < rowAmt - 1 && Maze2[rowCheck][colCheck] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH)colCheck++;
                    }
                    return [
                        rowCheck === 1 ? 0 : rowAmt - 1,
                        colCheck
                    ];
            }
        };
        return {
            Enter: getLocation(entWall),
            Exit: getLocation(exWall)
        };
    }
    return {
        Enter: [
            0,
            0
        ],
        Exit: [
            0,
            0
        ]
    };
};
let mazeGeneratorReturnObject = {
    Algorithm: RENDER_MAZE_AS.BACKTRACKER,
    AnimationDuration: 0,
    Egress: {
        Enter: [
            0,
            0
        ],
        Exit: [
            0,
            0
        ]
    },
    Grid: {
        amtColumn: 0,
        amtRow: 0
    },
    Maze: [
        [
            0
        ]
    ],
    Type: RENDER_MAZE_AS.PASSAGE,
    Seed: 0,
    SeedVerification: 0
}, _ANIMATION_DURATION = 0, Maze;
const huntPtArr = [], huntPtMap = {};
const markEggress = ()=>{
    const { Enter , Exit  } = mazeGeneratorReturnObject.Egress;
    Maze[Enter[0]][Enter[1]] = CELL_STATE.EGGRESS.ENTER;
    Maze[Exit[0]][Exit[1]] = CELL_STATE.EGGRESS.EXIT;
};
let carvedArray = [];
const getConsiderations = (pt)=>{
    const offset = Math.min(_pathAcitve.length, 2);
    const surroundingPts = {
        d: [
            pt[0] + offset,
            pt[1]
        ],
        l: [
            pt[0],
            pt[1] - offset
        ],
        r: [
            pt[0],
            pt[1] + offset
        ],
        u: [
            pt[0] - offset,
            pt[1]
        ]
    };
    const d = surroundingPts.d[0] < mazeGeneratorReturnObject.Grid.amtRow ? Maze[pt[0] + offset][pt[1]] : null;
    const l = surroundingPts.l[1] >= 0 ? Maze[pt[0]][pt[1] - offset] : null;
    const r = surroundingPts.r[1] < mazeGeneratorReturnObject.Grid.amtColumn ? Maze[pt[0]][pt[1] + offset] : null;
    const u = surroundingPts.u[0] >= 0 ? Maze[pt[0] - offset][pt[1]] : null;
    const considerArr = [];
    d === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.d);
    l === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.l);
    r === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.r);
    u === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED && considerArr.push(surroundingPts.u);
    carvedArray = [];
    d === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.d);
    l === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.l);
    r === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.r);
    u === CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH && carvedArray.push(surroundingPts.u);
    return considerArr;
};
const carveThrough = (pt, carveTo)=>{
    const carveThroughPt = pt[0] === carveTo[0] ? pt[1] > carveTo[1] ? [
        pt[0],
        pt[1] - 1
    ] : [
        pt[0],
        pt[1] + 1
    ] : pt[0] > carveTo[0] ? [
        pt[0] - 1,
        pt[1]
    ] : [
        pt[0] + 1,
        pt[1]
    ];
    Maze[carveThroughPt[0]][carveThroughPt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
};
const _pathAcitve = [];
const carveBacktrackMaze = (pt, offset = 2)=>{
    seedPointer.inc();
    if (offset - 1) {
        Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT;
    } else {
        _pathAcitve.push(pt);
    }
    const _considerations1 = getConsiderations(pt);
    _considerations1.forEach((c)=>{
        Maze[c[0]][c[1]] = CELL_STATE.COMMON.CONSIDER;
    });
    _ANIMATION_DURATION && renderGridPassage(Maze);
    if (_considerations1.length) {
        const carveTo = _considerations1[seedPointer() % _considerations1.length];
        _pathAcitve.push(carveTo);
        if (offset - 1) {
            carveThrough(pt, carveTo);
        }
        setTimeout(()=>{
            _considerations1.forEach((c)=>{
                Maze[c[0]][c[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED;
            });
            Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
            carveBacktrackMaze(_considerations1[seedPointer() % _considerations1.length]);
        }, _ANIMATION_DURATION);
    } else if (_pathAcitve.length) {
        setTimeout(()=>{
            Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
            if (mazeGeneratorReturnObject.Algorithm === RENDER_MAZE_AS.HUNT_AND_KILL) {
                let hunted = false;
                for(let row = 0; row < Maze.length; row++){
                    if (hunted) break;
                    for(let col = 0; col < Maze[row].length; col++){
                        if (Maze[row][col] === CELL_STATE[RENDER_MAZE_AS.PASSAGE].UNCARVED) {
                            huntPtMap[`${row}|${col}`] = getConsiderations([
                                row,
                                col
                            ]);
                            huntPtArr.push([
                                row,
                                col
                            ]);
                            hunted = true;
                            break;
                        }
                    }
                }
                if (!hunted) {
                    huntPtArr.forEach((huntd)=>{
                        getConsiderations(huntd);
                        let vCString = JSON.stringify(carvedArray);
                        huntPtMap[`${huntd[0]}|${huntd[1]}`].forEach((hnt)=>{
                            vCString = vCString.replace(JSON.stringify(hnt), '').replace(',,', ',').replace('[,', '[').replace(',]', ']');
                        });
                        const _validConsiderations = JSON.parse(vCString);
                        carveThrough(huntd, _validConsiderations[seedPointer.inc() % _validConsiderations.length]);
                        markEggress();
                        _ANIMATION_DURATION && renderGridPassage(Maze);
                        mazeGeneratorReturnObject.Maze = Maze;
                        if (typeof Deno !== 'undefined') {
                            console.log(JSON.stringify(mazeGeneratorReturnObject));
                        }
                    });
                    return;
                }
                carveBacktrackMaze(huntPtArr[huntPtArr.length - 1]);
            } else {
                let bkTrk = _pathAcitve.pop() || [
                    0,
                    0
                ];
                while(bkTrk[0] === pt[0] && bkTrk[1] === pt[1]){
                    bkTrk = _pathAcitve.pop() || [
                        0,
                        0
                    ];
                }
                bkTrk && carveBacktrackMaze(bkTrk);
            }
        }, _ANIMATION_DURATION);
    } else {
        markEggress();
        if (_ANIMATION_DURATION) renderGridPassage(Maze);
        mazeGeneratorReturnObject.Maze = Maze;
        if (typeof Deno !== 'undefined') {
            console.log(JSON.stringify(mazeGeneratorReturnObject));
        }
    }
};
let _considerations = [];
const carvePrimMaze = (pt, offset = 2)=>{
    seedPointer.inc();
    if (offset - 1) {
        Maze[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT;
        _pathAcitve.length === 1 && _pathAcitve.push(pt);
    } else {
        _pathAcitve.push(pt);
    }
    const _curConsiderations = getConsiderations(pt);
    _curConsiderations.forEach((c)=>{
        Maze[c[0]][c[1]] = CELL_STATE.COMMON.CONSIDER;
    });
    _considerations = [
        ..._curConsiderations,
        ..._considerations
    ];
    _ANIMATION_DURATION && renderGridPassage(Maze);
    const carveToIndex = carvedArray.length ? seedPointer() % carvedArray.length : seedPointer() % _curConsiderations.length;
    const carveTo = carvedArray.length ? carvedArray[carveToIndex] : _considerations.splice(carveToIndex, 1)[0];
    if (offset - 1) {
        carveThrough(pt, carveTo);
    }
    setTimeout(()=>{
        Maze[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
        Maze[carveTo[0]][carveTo[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
        let carveNext;
        if (offset - 1) {
            const _considerDenom = 10 / _considerations.length;
            carveNext = _considerations.splice(Math.floor(seedPointer() / _considerDenom), 1)[0];
        } else carveNext = carveTo;
        if (carveNext) carvePrimMaze(carveNext);
        else {
            markEggress();
            if (_ANIMATION_DURATION) renderGridPassage(Maze);
            mazeGeneratorReturnObject.Maze = Maze;
            if (typeof Deno !== 'undefined') {
                console.log(JSON.stringify(mazeGeneratorReturnObject));
            }
        }
    }, _ANIMATION_DURATION);
};
const generateMaze = (_maze)=>{
    Maze = _maze;
    mazeGeneratorReturnObject.Egress = createEgress(mazeGeneratorReturnObject.Algorithm, {
        Grid: mazeGeneratorReturnObject.Grid,
        seedPointer
    });
    markEggress();
    mazeGeneratorReturnObject.Algorithm === RENDER_MAZE_AS.PRIM ? carvePrimMaze(mazeGeneratorReturnObject.Egress.Enter, 1) : carveBacktrackMaze(mazeGeneratorReturnObject.Egress.Enter, 1);
};
const instantiate = (base)=>{
    seedPointer(0);
    const { _flatGrid  } = base.Grid;
    delete base.Grid._flatGrid;
    parseSeed(base.Seed, base.Grid.amtColumn * base.Grid.amtRow + base.Grid.amtRow);
    seedPointer.inc();
    mazeGeneratorReturnObject = {
        ...base,
        SeedVerification: parsedVerifiedValue()
    };
    _ANIMATION_DURATION = [
        mazeGeneratorReturnObject.AnimationDuration?.valueOf(),
        SHOW_ANIMATION
    ].sort().pop() || 0;
    generateMaze(_flatGrid);
};
typeof Deno !== 'undefined' && instantiate(JSON.parse(Deno.args[0]));
const generatePrimTracker = (base)=>{
    instantiate(base);
    return mazeGeneratorReturnObject;
};
let mazeGeneratorReturnObject1 = {
    Algorithm: RENDER_MAZE_AS.BACKTRACKER,
    AnimationDuration: 0,
    Egress: {
        Enter: [
            0,
            0
        ],
        Exit: [
            0,
            0
        ]
    },
    Grid: {
        amtColumn: 0,
        amtRow: 0
    },
    Maze: [
        [
            0
        ]
    ],
    Type: RENDER_MAZE_AS.PASSAGE,
    Seed: 0,
    SeedVerification: 0
}, _ANIMATION_DURATION1 = 0, Maze1;
const markEggress1 = ()=>{
    const { Enter , Exit  } = mazeGeneratorReturnObject1.Egress;
    Maze1[Enter[0]][Enter[1]] = CELL_STATE.EGGRESS.ENTER;
    Maze1[Exit[0]][Exit[1]] = CELL_STATE.EGGRESS.EXIT;
    _ANIMATION_DURATION1 && renderGridPassage(Maze1);
};
const updateInitialRow = ()=>{
    Maze1[0] = new Array(Maze1[0].length).fill(CELL_STATE.COMMON.NON_CONSIDERED);
    Maze1[2].forEach((c, i)=>{
        if (i && i < mazeGeneratorReturnObject1.Grid.amtColumn - 1 && c === CELL_STATE.COMMON.NON_CONSIDERED) {
            if (i - 1 > 0) {
                Maze1[1][i - 1] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
            }
            Maze1[1][i] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
            if (i + 1 < mazeGeneratorReturnObject1.Grid.amtColumn - 1) {
                Maze1[1][i + 1] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
            }
        }
    });
    seedPointer.inc();
};
let _pathAcitve1 = [];
const carveNorth = ()=>{
    let carveCol = _pathAcitve1[seedPointer.inc() % _pathAcitve1.length][1];
    const carveRow = _pathAcitve1[0][0] - 1;
    if (_pathAcitve1.length > 1) {
        while(carveCol > _pathAcitve1[0][1] && Maze1[carveRow - 1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH)carveCol--;
        if (Maze1[carveRow - 1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) {
            while(carveCol < _pathAcitve1[_pathAcitve1.length - 1][1] && Maze1[carveRow - 1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH)carveCol++;
        }
    }
    if (Maze1[carveRow - 1][carveCol] !== CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH) {
        Maze1[carveRow + 1][_pathAcitve1[0][1] - 1] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
    }
    Maze1[carveRow][carveCol] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
    _pathAcitve1 = [];
};
const carveSidewinderMaze = (pt)=>{
    if (pt[0] + 1 >= mazeGeneratorReturnObject1.Grid.amtRow) {
        updateInitialRow();
        mazeGeneratorReturnObject1.Egress = createEgress(mazeGeneratorReturnObject1.Algorithm, {
            Grid: mazeGeneratorReturnObject1.Grid,
            Maze: Maze1,
            seedPointer
        });
        markEggress1();
        mazeGeneratorReturnObject1.Maze = Maze1;
        if (typeof Deno !== 'undefined') {
            console.log(JSON.stringify(mazeGeneratorReturnObject1));
        }
        return;
    }
    Maze1[pt[0]][pt[1]] = CELL_STATE.COMMON.CURRENT;
    _pathAcitve1.push(pt);
    _ANIMATION_DURATION1 && renderGridPassage(Maze1);
    setTimeout(()=>{
        Maze1[pt[0]][pt[1]] = CELL_STATE[RENDER_MAZE_AS.PASSAGE].IN_PATH;
        if (pt[1] + 2 === mazeGeneratorReturnObject1.Grid.amtColumn || !(seedPointer.inc() % 4)) {
            carveNorth();
            pt[1] + 3 >= mazeGeneratorReturnObject1.Grid.amtColumn ? carveSidewinderMaze([
                pt[0] + 2,
                1
            ]) : carveSidewinderMaze([
                pt[0],
                pt[1] + 2
            ]);
        } else {
            carveSidewinderMaze([
                pt[0],
                pt[1] + 1
            ]);
        }
    }, _ANIMATION_DURATION1);
};
const generateMaze1 = (_maze)=>{
    Maze1 = _maze;
    carveSidewinderMaze([
        2,
        1
    ]);
};
const instantiate1 = (base)=>{
    seedPointer(0);
    const { _flatGrid  } = base.Grid;
    delete base.Grid._flatGrid;
    parseSeed(base.Seed, base.Grid.amtColumn * base.Grid.amtRow + base.Grid.amtRow);
    seedPointer.inc();
    mazeGeneratorReturnObject1 = {
        ...base,
        SeedVerification: parsedVerifiedValue()
    };
    _ANIMATION_DURATION1 = [
        mazeGeneratorReturnObject1.AnimationDuration?.valueOf(),
        SHOW_ANIMATION
    ].sort().pop() || 0;
    generateMaze1(_flatGrid);
};
typeof Deno !== 'undefined' && instantiate1(JSON.parse(Deno.args[0]));
const generateSidewinder = (base)=>{
    instantiate1(base);
    return mazeGeneratorReturnObject1;
};
const generateDungeon = ({ gw , gh , sa , ir  }, cb = ()=>{})=>{
    const dungeonAutomata = initCellularAutomata({
        gw,
        gh,
        sa,
        ir
    });
    const dungeonRooms = dungeonAutomata.CellularAutomata && applyFloodFill(dungeonAutomata.CellularAutomata, dungeonAutomata.seedArg || 0, dungeonAutomata.verifySeed || 0);
    const dungeonCorridor = createCorridors(dungeonRooms);
    const dungeon = dungeonCorridor.CorridorAutomata[0];
    const dungeonMap = document.getElementById('game');
    if (dungeonMap) dungeonMap.innerHTML = '';
    let dungeonMapString = '';
    dungeonMap && dungeon.forEach((row, indx)=>{
        row.forEach((i, idx)=>{
            dungeonMapString += `<span data-point="${idx}|${indx}" data-point-type="`;
            dungeonMapString += i === '#' ? 'bridge">&nbsp;' : /⊡|^1$/g.test(i) ? 'on">&nbsp;' : 'off">&nbsp;';
            dungeonMapString += `</span>`;
        });
        dungeonMapString += '<br />';
    });
    if (dungeonMap) dungeonMap.innerHTML = dungeonMapString;
    cb && cb();
};
const generateMaze2 = ({ gw , gh , seedArg: seedArg2 , mazeType , algorithm  }, cb = ()=>{})=>{
    const mazeBase = setMazeProps(gh, gw, seedArg2, algorithm, mazeType);
    const generatedMaze = algorithm === 'RENDER_MAZE.WITH_SIDEWINDER' ? generateSidewinder(mazeBase) : generatePrimTracker(mazeBase);
    return generatedMaze;
};
const createSeedHash = (s = null)=>{
    const hashSeed = s || new Date().getTime().toString();
    window.location.hash = hashSeed;
};
const setCellularAutomataArgs = ()=>{
    console.log('generateMaze({gw:12, gh:8})', generateMaze2({
        gw: 12,
        gh: 8
    }));
    console.log('generateMaze({gw:12, gh:8, algorithm:SIDEWINDER})', generateMaze2({
        gw: 12,
        gh: 8,
        algorithm: 'RENDER_MAZE.WITH_SIDEWINDER'
    }));
    const generatorArgs = {
        gw: 0,
        gh: 0,
        sa: 0,
        ir: 0
    };
    const spans = document.querySelectorAll('[data-gen-attr]');
    spans.forEach((arg)=>{
        generatorArgs[arg.dataset.genAttr || 'gw'] = parseInt(arg.innerText, 10);
    });
    if (!generatorArgs.sa) {
        createSeedHash();
        generatorArgs.sa = parseInt(window.location.hash.replace('#', ''));
    }
    const seedInputText = document.querySelector('span[data-gen-attr="sa"]').innerText;
    if (seedInputText.length && window.location.hash !== '#' + seedInputText) {
        window.location.hash = document.querySelector('span[data-gen-attr="sa"]').innerText;
    }
    generateDungeon({
        ...generatorArgs
    }, ()=>{
        document?.getElementById('generate-button')?.removeAttribute('disabled');
    });
};
if (!window.location.hash) {
    createSeedHash();
}
document.querySelector('span[data-gen-attr="sa"]').innerText = window.location.hash.replace('#', '');
if (typeof document !== 'undefined') {
    document?.getElementById('generate-button')?.addEventListener('click', setCellularAutomataArgs);
    document?.getElementById('generate-random-button')?.addEventListener('click', ()=>{
        document.querySelector('span[data-gen-attr="sa"]').innerText = '';
        setCellularAutomataArgs();
    });
    document?.querySelectorAll('li')?.forEach((li)=>li.addEventListener('click', (e)=>{
            const seedit = e.target?.innerText.split(' ');
            const spans = document.querySelectorAll('[data-gen-attr]');
            seedit.forEach((sd, indx)=>{
                spans[indx].innerText = sd;
            });
            setCellularAutomataArgs();
        })
    );
}

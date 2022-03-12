// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const RENDER_MAZE_AS = {
    PASSAGE: 'RENDER_MAZE_AS.PASSAGE',
    WALLED: 'RENDER_MAZE_AS.WALLED'
};
const CELL_STATE = {
    COMMON: {
        CREATED: -2,
        CONSIDER: -1
    }
};
CELL_STATE[RENDER_MAZE_AS.PASSAGE] = {
    CONCRETE: 0,
    CARVED: 1
};
CELL_STATE[RENDER_MAZE_AS.WALLED] = {
    OPEN: 10,
    BOTTOM: 0,
    LEFT: 1,
    RIGHT: 2,
    TOP: 3
};
const renderDefaultGrid = (Grid1)=>{
    Grid1.forEach((row)=>{
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
const renderWalledGrid = (Grid2)=>{
    Grid2.forEach((row)=>{
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
const renderGrid = (Grid3, opts = {}, _DEBUG = false)=>{
    _DEBUG && console.log('opts', opts);
    !_DEBUG && console.clear();
    const topBorder = [
        ...Array(Grid3[0].length + 2).fill('_')
    ], bottomBorder = [
        ...Array(Grid3[0].length + 2).fill('—')
    ];
    console.log(...topBorder);
    switch(opts.type){
        case RENDER_MAZE_AS.WALLED:
            renderWalledGrid(Grid3);
            break;
        default:
            renderDefaultGrid(Grid3);
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
const SETTINGS = {
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
        survived ? SETTINGS.RENDER_AGGREGATE_DELTA ? this._stateNext = ++this._amtLived + this._amtDied : this._stateNext = ++this._amtLived : SETTINGS.RENDER_AGGREGATE_DELTA ? this._stateNext = this._amtLived + --this._amtDied : this._stateNext = --this._amtDied;
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
                this.verifySeed += cellInitValue ? parseInt(cellInitValue, 10) : 0;
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
                if (SETTINGS.SURVIVING_CELL_RANGE.includes(livingNeighbors)) {
                    curCell.storeNextState(true);
                } else {
                    curCell.storeNextState();
                }
            } else {
                if (SETTINGS.TO_LIFE_RANGE.includes(livingNeighbors)) {
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
                const renderChar = SETTINGS.RENDER_AS.BINARY(this._gridmap[`${gX}|${gY}`].stateCur);
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
    const cellAmt = gridW * gridH;
    const seed = new PRNG(seedArg1);
    let seededStr = '';
    while(seededStr.length < cellAmt)seededStr += String(seed.next(10, 100)).replace(/[^0-9]/g, '');
    seededStr = seededStr.slice(0, cellAmt);
    return seededStr.split('');
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
        CellularAutomata = SETTINGS.RETURN_ALL_STEPS ? CellularAutomataSteps : CellularAutomata;
        cellularAutomataReturnObject.CellularAutomata = CellularAutomata;
        cellularAutomataReturnObject.verifySeed = grd.verifySeed;
        cellularAutomataReturnObject.iterations_run = curIt;
        typeof Deno !== 'undefined' && console.log(JSON.stringify(cellularAutomataReturnObject));
    }
};
let gridW, gridH, seedArg, iterationsRemaining = 0, grd;
const initCellularAutomata = (props)=>{
    false && console.log('props', props);
    gridW = props.gw || SETTINGS.GRID_WIDTH, gridH = props.gh || SETTINGS.GRID_HEIGHT, seedArg = props.sa ? parseSeedArg(props.sa) : parseSeedArg(new Date().getTime());
    iterationsRemaining = props.ir || SETTINGS.ITERATIONS;
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
const createSeedHash = (s = null)=>{
    const hashSeed = s || new Date().getTime().toString();
    window.location.hash = hashSeed;
};
const setCellularAutomataArgs = ()=>{
    document?.getElementById('generate-button')?.setAttribute('disabled', 'true');
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

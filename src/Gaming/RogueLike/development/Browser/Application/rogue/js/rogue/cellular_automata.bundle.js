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
const renderGrid = (Grid1, _DEBUG = false)=>{
    !_DEBUG && console.clear();
    const topBorder = [
        ...Array(Grid1[0].length + 2).fill('_')
    ], bottomBorder = [
        ...Array(Grid1[0].length + 2).fill('—')
    ];
    console.log(...topBorder);
    Grid1.forEach((row)=>{
        const graphics = row.map((i)=>i === '#' ? '#' : /⊡|^1$/g.test(i) ? '🀫' : ' '
        );
        const gRow = [
            '|',
            ...graphics,
            '|'
        ];
        console.log(...gRow);
    });
    console.log(...bottomBorder);
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
    _gridmap = {
    };
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
    while(seededStr.replace(/[^0-9]/g, '').length < cellAmt)seededStr += seed.next(10, 100);
    seededStr = seededStr.replace(/[^0-9]/g, '').slice(0, cellAmt);
    return seededStr.split('');
};
const cellularAutomataReturnObject = {
};
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
        console.log(JSON.stringify(cellularAutomataReturnObject));
    }
};
let gridW, gridH, seedArg, iterationsRemaining = 0, grd;
const initCellularAutomata = ()=>{
    const { gw , gh , sa , ir  } = document.getElementById('grid-config')?.innerHTML ? JSON.parse(document.getElementById('grid-config')?.innerHTML) : {
        gw: SETTINGS.GRID_WIDTH,
        gh: SETTINGS.GRID_HEIGHT,
        sa: new Date().getTime(),
        ir: SETTINGS.ITERATIONS
    }, gridW1 = gw || SETTINGS.GRID_WIDTH, gridH1 = gh || SETTINGS.GRID_HEIGHT, seedArg2 = sa ? parseSeedArg(sa) : parseSeedArg(new Date().getTime());
    iterationsRemaining = ir || SETTINGS.ITERATIONS;
    grd = new Grid(gridH1, gridW1);
    grd.init(seedArg2, onGridAndSeedInit);
};
typeof document !== 'undefined' && document?.getElementById('generate-button')?.addEventListener('click', initCellularAutomata);
if (typeof Deno !== 'undefined' && Deno?.args.length) {
    gridW = Deno.args[0] && parseInt(Deno.args[0], 10) ? parseInt(Deno.args[0], 10) : SETTINGS.GRID_HEIGHT, gridH = Deno.args[1] && parseInt(Deno.args[1], 10) ? parseInt(Deno.args[1], 10) : SETTINGS.GRID_WIDTH, seedArg = Deno.args[2] ? parseSeedArg(parseInt(Deno.args[2], 10)) : parseSeedArg(new Date().getTime());
    iterationsRemaining = Deno.args[3] && parseInt(Deno.args[3], 10) ? parseInt(Deno.args[3], 10) : SETTINGS.ITERATIONS;
    grd = new Grid(gridH, gridW);
    grd.init(seedArg, onGridAndSeedInit);
}

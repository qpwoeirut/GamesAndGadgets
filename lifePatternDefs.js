const BLOCK = 100;
const BEEHIVE = 101;
const LOAF = 102;
const BOAT = 103;
const TUB = 104;
const BLINKER = 200;
const TOAD = 201;
const BEACON = 202;
const PULSAR = 203;
const PENTA_DECATHALON = 204;
const GLIDER = 300;
const LWSS = 301;
const MWSS = 302;
const HWSS = 303;
const R_PENTOMINO = 900;
const DIEHARD = 901;
const ACORN = 902;
const GOSPER_GLIDER_GUN = 903;

const stillPatterns = [
    BLOCK,
    BEEHIVE,
    LOAF,
    BOAT,
    TUB
];
const oscillatingPatterns = [
    BLINKER,
    TOAD,
    BEACON,
    PULSAR,
    PENTA_DECATHALON
];
const spaceshipPatterns = [
    GLIDER,
    LWSS,
    MWSS,
    HWSS
];
const miscPatterns = [
    R_PENTOMINO,
    DIEHARD,
    ACORN,
    GOSPER_GLIDER_GUN
]

const patternStrings = new Map([
    [BLOCK, "block"],
    [BEEHIVE, "beehive"],
    [LOAF, "loaf"],
    [BOAT, "boat"],
    [TUB, "tub"],
    [BLINKER, "blinker"],
    [TOAD, "toad"],
    [BEACON, "beacon"],
    [PULSAR, "pulsar"],
    [PENTA_DECATHALON, "penta-decathalon"],
    [GLIDER, "glider"],
    [LWSS, "light-weight-spaceship"],
    [MWSS, "middle-weight-spaceship"],
    [HWSS, "heavy-weight-spaceship"],
    [R_PENTOMINO, "r-pentomino"],
    [DIEHARD, "diehard"],
    [ACORN, "acorn"],
    [GOSPER_GLIDER_GUN, "gosper-glider-gun"]
]);

const blockPattern = [
    [1, 1],
    [1, 1]
]
const beehivePattern = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
]
const loafPattern = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0]
]
const boatPattern = [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 0]
];
const tubPattern = [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0]
]

const blinkerPattern = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
]
const toadPattern = [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [1, 1, 1, 0],
    [0, 0, 0, 0]
]
const beaconPattern = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1]
]
const pulsarPattern = [
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
]
const pentaDecathalonPattern = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const gliderPattern = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0]
]
const LWSSPattern = [
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0] // empty row since ship uses this row as it moves
]
const MWSSPattern = [
    [0, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 1, 1],
    [0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0] // empty row since ship uses this row as it moves
]
const HWSSPattern = [
    [0, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0] // empty row since ship uses this row as it moves
]

const rPentominoPattern = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0]
]
const diehardPattern = [
    [0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 1]
]
const acornPattern = [
    [0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 0, 1, 1, 1]
]
const gosperGliderGunPattern = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

const patternArrays = new Map([
    [BLOCK, blockPattern],
    [BEEHIVE, beehivePattern],
    [LOAF, loafPattern],
    [BOAT, boatPattern],
    [TUB, tubPattern],
    [BLINKER, blinkerPattern],
    [TOAD, toadPattern],
    [BEACON, beaconPattern],
    [PULSAR, pulsarPattern],
    [PENTA_DECATHALON, pentaDecathalonPattern],
    [GLIDER, gliderPattern],
    [LWSS, LWSSPattern],
    [MWSS, MWSSPattern],
    [HWSS, HWSSPattern],
    [R_PENTOMINO, rPentominoPattern],
    [DIEHARD, diehardPattern],
    [ACORN, acornPattern],
    [GOSPER_GLIDER_GUN, gosperGliderGunPattern]
]);
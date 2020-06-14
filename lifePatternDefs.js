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
    [HWSS, "heavy-weight-spaceship"]
]);

const patternArrays = new Map([
    [BLOCK, [
        [1, 1],
        [1, 1]
    ]],
    [BEEHIVE, [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
    ]],
    [LOAF, [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 0]
    ]],
    [BOAT, [
        [1, 1, 0],
        [1, 0, 1],
        [0, 1, 0]
    ]],
    [TUB, [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0]
    ]],
    [BLINKER, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]],
    [TOAD, [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ]],
    [BEACON, [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 1, 1],
        [0, 0, 1, 1]
    ]],
    [PULSAR, [
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
    ]],
    [PENTA_DECATHALON, [
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
    ]],
    [GLIDER, [
        [1, 1, 1],
        [0, 0, 1],
        [0, 1, 0]
    ]],
    [LWSS, []],
    [MWSS, []],
    [HWSS, []]
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
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
]
const pentaDecathalonPattern = [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
]

const gliderPattern = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0]
]
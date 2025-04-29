export const TILE_TYPES = {
    WATER: 'eau',
    MOUNTAIN: 'montagne',
    FOREST: 'foret',
    MINE: 'mine',
    RICE: 'riziere',
    PLAIN: 'plaine'
};

export const TILE_CONFIGS = {
    A: {
        image: '/images/Am.webp',
        zones: [
            TILE_TYPES.WATER,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MINE,
            TILE_TYPES.WATER,
            TILE_TYPES.FOREST,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.PLAIN
        ]
    },
    B: {
        image: '/images/Bm.webp',
        zones: [
            TILE_TYPES.FOREST,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MINE,
            TILE_TYPES.WATER,
            TILE_TYPES.FOREST,
            TILE_TYPES.WATER,
            TILE_TYPES.PLAIN
        ]
    },
    C: {
        image: '/images/Cm.webp',
        zones: [
            TILE_TYPES.WATER,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.PLAIN,
            TILE_TYPES.FOREST,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MINE,
            TILE_TYPES.MOUNTAIN
        ]
    },
    D: {
        image: '/images/Dm.webp',
        zones: [
            TILE_TYPES.PLAIN,
            TILE_TYPES.WATER,
            TILE_TYPES.FOREST,
            TILE_TYPES.MINE,
            TILE_TYPES.PLAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.WATER
        ]
    },
    E: {
        image: '/images/Em.webp',
        zones: [
            TILE_TYPES.WATER,
            TILE_TYPES.RICE,
            TILE_TYPES.RICE,
            TILE_TYPES.PLAIN,
            TILE_TYPES.WATER,
            TILE_TYPES.WATER,
            TILE_TYPES.MOUNTAIN
        ]
    },
    F: {
        image: '/images/Fm.webp',
        zones: [
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.RICE,
            TILE_TYPES.PLAIN,
            TILE_TYPES.FOREST,
            TILE_TYPES.WATER,
            TILE_TYPES.MOUNTAIN
        ]
    },
    G: {
        image: '/images/Gm.webp',
        zones: [
            TILE_TYPES.PLAIN,
            TILE_TYPES.RICE,
            TILE_TYPES.MINE,
            TILE_TYPES.RICE,
            TILE_TYPES.FOREST,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN
        ]
    },
    H: {
        image: '/images/Hm.webp',
        zones: [
            TILE_TYPES.MINE,
            TILE_TYPES.MINE,
            TILE_TYPES.WATER,
            TILE_TYPES.WATER,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.RICE,
            TILE_TYPES.WATER
        ]
    },
    I: {
        image: '/images/Im.webp',
        zones: [
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.WATER,
            TILE_TYPES.RICE,
            TILE_TYPES.FOREST
        ]
    },
    J: {
        image: '/images/Jm.webp',
        zones: [
            TILE_TYPES.RICE,
            TILE_TYPES.WATER,
            TILE_TYPES.PLAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.RICE,
            TILE_TYPES.MINE,
            TILE_TYPES.MOUNTAIN
        ]
    },
    K: {
        image: '/images/Km.webp',
        zones: [
            TILE_TYPES.PLAIN,
            TILE_TYPES.WATER,
            TILE_TYPES.FOREST,
            TILE_TYPES.FOREST,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.WATER
        ]
    },
    L: {
        image: '/images/Lm.webp',
        zones: [
            TILE_TYPES.WATER,
            TILE_TYPES.WATER,
            TILE_TYPES.MINE,
            TILE_TYPES.PLAIN,
            TILE_TYPES.MINE,
            TILE_TYPES.WATER,
            TILE_TYPES.WATER
        ]
    },
    M: {
        image: '/images/Mm.webp',
        zones: [
            TILE_TYPES.WATER,
            TILE_TYPES.WATER,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.FOREST,
            TILE_TYPES.PLAIN,
            TILE_TYPES.MINE
        ]
    },
    N: {
        image: '/images/Nm.webp',
        zones: [
            TILE_TYPES.PLAIN,
            TILE_TYPES.FOREST,
            TILE_TYPES.PLAIN,
            TILE_TYPES.RICE,
            TILE_TYPES.MINE,
            TILE_TYPES.WATER,
            TILE_TYPES.RICE
        ]
    },
    O: {
        image: '/images/Om.webp',
        zones: [
            TILE_TYPES.WATER,
            TILE_TYPES.WATER,
            TILE_TYPES.MINE,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.MOUNTAIN,
            TILE_TYPES.FOREST,
            TILE_TYPES.RICE
        ]
    }
}; 
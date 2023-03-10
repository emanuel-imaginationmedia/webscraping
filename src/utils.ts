export const formatName = (text: string): string => {
    return text.split(' - ')[0];
};

export const formatPrice = (text: string): number => {
    return (
        parseInt(
            text
                .split(' - ')[1]
                .replace(/[^0-9]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
        ) * 100
    );
};

export const formatKey = (text: string): string => {
    return text
        .replace(/[^a-zA-Z0-9- ]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
        .split(' ')
        .join('-');
};

const METAL = ['14k-white-gold', '14k-yellow-gold', 'gold-vermeil', 'sterling-silver', 'titanium', 'black-titanium'];
const STONE = [
    'diamond',
    'gemstone',
    'no-gem',
    'pearl',
    'turquoise',
    'london-blue-topaz',
    'peridot',
    'iolite',
    'blue-lace-agate',
    'citrine',
    'red-onyx',
    'green-aventurine',
    'white-topaz',
    'opal',
    'blue-sapphire',
    'tsavorite',
    'pink-sapphire',
    'rhodolite',
    'green-tourmaline',
    'blue-topaz',
    'garnet',
    'sky-blue-topaz',
    'honey-quartz',
    'black-onyx',
    'malachite',
    'howlite',
    'aquamarine',
];
const COLOR = {
    '#000000': ['black-titanium', 'black-onyx'],
    '#0000FF': ['turquoise', 'london-blue-topaz', 'blue-lace-agate', 'opal', 'blue-sapphire', 'blue-topaz', 'sky-blue-topaz', 'aquamarine'],
    '#964B00': ['honey-quartz'],
    '#00FF00': ['peridot', 'green-aventurine', 'opal', 'tsavorite', 'green-tourmaline', 'malachite'],
    '#808080': ['titanium'],
    '#C0C0C0': ['sterling-silver', '14k-white-gold'],
    '#FFA500': ['citrine'],
    '#FFC0CB': ['pink-sapphire'],
    '#A020F0': ['iolite', 'rhodolite'],
    '#FF0000': ['red-onyx', 'garnet'],
    '#FFFFFF': ['diamond', 'pearl', 'white-topaz', 'howlite'],
    '#FFFF00': ['14k-yellow-gold', 'gold-vermeil'],
};

export const getMetalStoneAndColor = (
    text: string
): {
    metal: string[];
    stone: string[];
    color: string[];
} => {
    const metal: string[] = [];
    const stone: string[] = [];
    const color: string[] = [];

    const keys = text.split(',').map((title) => formatKey(title));
    keys.forEach((key) => {
        if (METAL.includes(key)) {
            metal.push(key);
        } else if (STONE.includes(key)) {
            stone.push(key);
        } else {
            throw new Error('Unavailable attribute');
        }

        for (const [colorKey, colorArray] of Object.entries(COLOR)) {
            if (colorArray.includes(key)) {
                color.push(colorKey);
            }
        }
    });

    if (!metal.length && !stone.length) {
        throw new Error('Variant without attributes');
    }

    return {
        metal,
        stone,
        color,
    };
};

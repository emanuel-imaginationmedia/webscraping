export const formatName = (text: string) => {
    return text.split(' - ')[0];
};

export const formatKey = (text: string) => {
    return text
        .replace(/[^a-zA-Z0-9- ]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
        .split(' ')
        .join('-');
};

import { dd } from './helpers';

const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};

export const allowLangs = [ 'en', 'uk', 'ru' ];
const appLangs = [ 'source', ...allowLangs ];
const alias = appLangs.reduce((res, lang) => {
    let fullLang = {};

    try {
        const fileLang = require(`../langs/${ lang }`);

        fullLang = mergeDeep(fullLang, fileLang);
    } catch (error) {
        console.info('Not service file load:', lang);

        fullLang = mergeDeep(fullLang, require('../langs/source'));
    }

    res[lang] = fullLang;

    return res;
}, {});

export const getLangCode = () => {
    try {
        const manualLang = localStorage.getItem('lang');
        if (manualLang && allowLangs.includes(manualLang)) {
            return manualLang;
        }

        const browserLang = navigator.language.split('-')[0];
        if (allowLangs.includes(browserLang)) {
            return browserLang;
        }
    } catch (error) {
        console.error('Error get lang code:', error);
    }

    return 'en';
};

export const lang = (path) => {
    const langCode = getLangCode();
    const currentLang = alias[langCode] || alias.en;

    try {
        const levels = path.split('.');

        let found = currentLang;
        let needSource = false;

        for (let level of levels) {
            if (found[level]) {
                found = found[level];
            } else {
                needSource = true;
                break;
            }
        }

        if (needSource) {
            let foundSource = alias.source;

            for (let level of levels) {
                foundSource = foundSource[level];
            }

            return foundSource || path;
        }

        return found;
    } catch (error) {
        dd(`Lang error for path: ${ path }`, error);

        return path;
    }
};

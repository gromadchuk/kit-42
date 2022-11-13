import { getLangCode, lang } from './lang';

export const getDefaultTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
}

export const setTheme = (theme) => {
    let schemeAttribute = document.createAttribute('scheme');
    schemeAttribute.value = theme === 'dark' ? 'space_gray' : 'bright_light';
    document.body.attributes.setNamedItem(schemeAttribute);
};

export const formatNumber = (number, inlineSpace = false) => {
    if (number === null) {
        return 0;
    }

    return `${number}`.replace(/(\d)(?=(\d{3})+$)/g, inlineSpace ? '$1\u00a0' : '$1 ');
};

export const getPercent = (count, total) => {
    return Math.floor(100 * +count / +total);
};

export const dd = (...mix) => {
    console.log(...mix);
};

export const linkProps = (link) => {
    if (!link) {
        return null;
    }

    return {
        href: link,
        target: '_blank'
    };
};

export const sleep = async (time = 350) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

export const decline = (number, titles) => {
    const langCode = getLangCode();

    if (langCode === 'en') {
        if (number === 0 || number === 1) {
            return titles[0];
        }

        return titles[1];
    }

    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

export const declineAndFormat = (count, array) => {
    return `${ formatNumber(count) } ${ decline(count, array) }`;
};

export const getProgressCount = (count, total) => {
    if (total === 0) {
        return 0;
    }

    const percent = Math.round(100 * count / total);

    return percent > 100 ? 100 : percent;
};

export const isInViewport = (el, size) => {
    if (!el) return false;

    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + size &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + size
    );
};

export const getTime = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let days = 0;

    if (hours >= 24) {
        days = parseInt(hours / 24);
        hours = hours % 24;
    }

    return {
        days,
        hours,
        minutes,
        seconds
    };
};

export const getTextTime = (seconds, array = false) => {
    const period = getTime(seconds);
    const res = [];

    if (period.days) {
        res.push(`${ period.days } ${ decline(period.days, lang('app.time_decline.days')) }`);
    }

    if (period.hours) {
        res.push(`${ period.hours } ${ decline(period.hours, lang('app.time_decline.hours')) }`);
    }

    if (period.minutes) {
        res.push(`${ period.minutes } ${ decline(period.minutes, lang('app.time_decline.minutes')) }`);
    }

    if (period.seconds) {
        res.push(`${ period.seconds } ${ decline(period.seconds, lang('app.time_decline.seconds')) }`);
    }

    return array ? res : res.join(' ');
};

import localforage from 'localforage';

import { dd } from './helpers';

export class Cache {

    constructor() {
        this.prefix = 'Cache';

        this.clearOldCache();
    }

    getPrefix(key) {
        return `${ this.prefix }:${ window.userId }:${ key }`;
    }

    async get(key, callback, minutes = 5) {
        const cache = await localforage.getItem(this.getPrefix(key));

        dd('Cache — get', key, !!cache);

        if (cache) {
            try {
                const json = JSON.parse(cache);

                if (json.timestamp > this.getCurrentTimestamp() && !json.data.error) {
                    dd('Cache — data', this.consoleData(json.data));

                    return json.data;
                }
            } catch (error) {
                dd('Cache — error', error);
            }
        }

        const data = await callback();

        if (!data.error_message) {
            this.set(key, data, minutes);
        }

        return data;
    }

    async getOnlyCache(key) {
        const cache = await localforage.getItem(this.getPrefix(key));

        dd('Cache — getOnlyCache', key, !!cache);

        if (cache) {
            try {
                const json = JSON.parse(cache);

                if (json.timestamp > this.getCurrentTimestamp() && !json.data.error) {
                    dd('Cache.ok — data', this.consoleData(json.data));

                    return json.data;
                }
            } catch (error) {
                dd('Cache — error', error);
            }
        }

        return null;
    }

    consoleData = (data) => {
        if (typeof data === 'string' && data.startsWith('data:image/')) {
            return 'BASE64_IMAGE'
        }

        return data;
    };

    async set(key, data, minutes) {
        const timestamp = this.getCurrentTimestamp();

        try {
            dd('Cache — set', key, this.consoleData(data));

            const verify = JSON.parse(JSON.stringify(data));

            if (Object.keys(verify).length !== 0) {
                return await localforage.setItem(this.getPrefix(key), JSON.stringify({
                    timestamp: timestamp + (minutes * 60),
                    data
                }));
            }
        } catch (error) {
            dd('Cache — error', error);
        }

        return false;
    }

    async remove(key) {
        return await localforage.removeItem(this.getPrefix(key));
    }

    clearOldCache() {
        localforage.iterate((value, key) => {
            const isCacheItem = key.slice(0, this.prefix.length) === this.prefix;

            if (isCacheItem) {
                try {
                    const json = JSON.parse(value);

                    if (json.timestamp < this.getCurrentTimestamp()) {
                        dd('Cache — remove old', key);

                        localforage.removeItem(key);
                    }
                } catch (error) {
                    dd('Cache — error', error);
                }
            }
        }).catch((error) => {
            dd('clearOldCache', error);
        });
    }

    getCurrentTimestamp() {
        const millis = Date.now();

        return Math.floor(millis / 1000);
    }

}

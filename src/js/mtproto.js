import MTProtoBrowser from './mtproto-core/envs/browser';

import { dd, sleep } from './helpers';
import { Cache } from './cache';
import { lang } from './lang';

const id = 24437742;
const hash = '61dc241a121c9253ab880d0f662c2b89';

export class MTProto {

    constructor({ showWaitPopout }) {
        this.instance = new MTProtoBrowser({
            api_id: id,
            api_hash: hash,
            // test: true,
            // storageOptions: {
            //     instance: new CustomStorage()
            // }
        });

        this.cache = new Cache();
        this.showWaitPopout = showWaitPopout;
    }

    checkDc = async () => {
        const { nearest_dc } = await this.call('help.getNearestDc');

        if (nearest_dc) {
            this.instance.setDefaultDc(nearest_dc);
        }
    };

    getError = (error) => {
        return lang(`MTProtoErrors.${ error }`);
    };

    call = async (method, params = {}, options = {}) => {
        dd('MTProto.request', method, params);

        try {
            const data = await this.instance.call(method, params, options);

            dd('MTProto.response', method, data);

            return data;
        } catch (error) {
            dd('MTProto.error', method, error);

            if (error.error_message) {
                const errorMigrate = error.error_message.match(/^(FILE_MIGRATE_|PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/);
                const errorWait = error.error_message.match(/^(FLOOD_WAIT_)(\d+)/);

                if (errorMigrate) {
                    const [, , newDcId] = errorMigrate;

                    this.instance.setDefaultDc(+newDcId);

                    return await this.call(method, params);
                } else if (errorWait) {
                    let [, , waitSeconds] = error.error_message.split('_', 3);

                    const intSeconds = +waitSeconds;
                    if (intSeconds) {
                        if (method !== 'upload.getFile') {
                            this.showWaitPopout(intSeconds);
                        }

                        await sleep(intSeconds * 1000);

                        return this.call(method, params);
                    }
                }
            }

            return error;
        }
    };

    callWithCache = async (key, method, params = {}, minutes = 5) => {
        const data = await this.cache.get(key, async () => {
            return await this.call(method, params);
        }, minutes);

        dd('MTProtoCallWithCache data', data);

        return data;
    };

}

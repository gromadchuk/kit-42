import { AbstractMethod } from './AbstractMethod';

import { Group, FormStatus, Div, SimpleCell, Header } from '@vkontakte/vkui';
import {
    Icon28AttachOutline,
    Icon28CalendarOutline,
    Icon28MessagesOutline,
    Icon28PhoneOutline,
    Icon28StickerOutline,
    Icon28VideoOutline,
    Icon28VoiceOutline
} from '@vkontakte/icons';

import { TabsList } from '../components/TabsList';

export class DialogsMessagesStat extends AbstractMethod {

    beforeLogic = async () => {
        this.initProgress();

        const { chats, users, dialogs } = await this.MTProto.call('messages.getDialogs', {
            offset_peer: { _: 'inputPeerEmpty' },
            limit: 100,
        });

        this.saveOwnersInfo(chats, users);

        const filteredDialogs = dialogs.filter((dialog) => {
            const owner = this.getOwnerInfo(dialog.peer);

            return !owner.migrated_to;
        });

        this.setState({ dialogs: filteredDialogs });

        this.endProgress();
    };

    selectPeer = async (dialog) => {
        this.setState({ selectedDialog: dialog });

        this.initProgress();

        const { count } = await this.MTProto.call('messages.getHistory', {
            peer: this.getPeerFormatted(dialog.peer),
            limit: 1,
            filter: {
                _: 'inputMessagesFilterEmpty'
            }
        });

        if (!count) {
            return this.showMethodFinish(this.lang('methods.dialogs_messages_stat.no_messages'), false);
        }

        if (count < 20) {
            return this.showMethodFinish(this.lang('methods.dialogs_messages_stat.too_few_messages'), false);
        }

        const periods = [
            1, // 1 day
            3, // 3 days
            7, // 1 week
            14, // 2 weeks
            30, // 1 month
            90, // 3 months
            180, // 6 months
            365, // 1 year
        ];
        const periodsData = [];

        if (count < 3_000) {
            const messages = await this.getMessages(dialog, count);

            for (const period of periods) {
                const periodDate = Math.round(+this.moment().add(-period, 'days') / 1000);

                const periodMessages = messages.filter((message) => message.date > periodDate);

                periodsData.push({
                    period,
                    disabled: periodMessages.length === 0,
                    count: periodMessages.length,
                    periodDate,
                });
            }
        } else {
            for (const period of periods) {
                const periodDate = Math.round(+this.moment().add(-period, 'days') / 1000);

                const { offset_id_offset } = await this.MTProto.call('messages.search', {
                    peer: this.getPeerFormatted(dialog.peer),
                    limit: 1,
                    max_date: periodDate,
                    filter: {
                        _: 'inputMessagesFilterEmpty'
                    }
                });

                periodsData.push({
                    period,
                    circa: true,
                    disabled: !offset_id_offset,
                    count: offset_id_offset + 1,
                    periodDate,
                });
            }
        }

        periodsData.push({
            period: 'all',
            count
        });

        this.log('periodsData', periodsData);

        this.endProgress();

        this.setState({
            periods: periodsData
        });
    };

    getMessages = async (dialog, total, endTime) => {
        if (this.allMessages) {
            if (endTime) {
                return this.allMessages.filter((message) => message.date > endTime);
            }

            return this.allMessages;
        }

        const allMessages = [];

        this.initProgress(this.lang('methods.dialogs_messages_stat.get_messages'), total);

        const params = {
            peer: this.getPeerFormatted(dialog.peer),
            limit: 100,
        };

        while (true) {
            const { messages, chats, users } = await this.MTProto.call('messages.getHistory', params);

            this.saveOwnersInfo(chats, users);

            const filteredMessages = endTime
                ? messages.filter((message) => message.date > endTime)
                : messages;

            if (filteredMessages.length) {
                allMessages.push(...filteredMessages);

                this.setProgressCount(allMessages.length);

                params.offset_id = messages[messages.length - 1].id;
            } else {
                break;
            }
        }
        this.log('allMessages', allMessages);

        this.allMessages = allMessages;

        return this.allMessages;
    };

    calcStat = async (total, periodDate) => {
        const allMessages = await this.getMessages(this.state.selectedDialog, total, periodDate);

        let lastPeerId = 0;
        const groupedIds = {};
        const peersData = {};
        const statData = {
            firstMessage: allMessages.reduce((prev, current) => {
                return (prev.date < current.date) ? prev : current;
            }),
            lastMessage: allMessages.reduce((prev, current) => {
                return (prev.date > current.date) ? prev : current;
            }),
            count: 0,
            uniqCount: 0,
            voiceDuration: 0,
            roundDuration: 0,
            callDuration: 0,
            attachmentsTypes: {},
            emoji: {},
            attachments: 0,
            stickers: {},
            stickersTotal: 0,
            servicesMessages: {},
        };

        allMessages.forEach((message) => {
            const peerId = this.getPeerId(message.from_id || message.peer_id);

            if (!peersData[peerId]) {
                peersData[peerId] = {
                    count: 0,
                    uniqCount: 0,
                    emoji: 0,
                    attachments: 0,
                    stickers: 0,
                    voiceDuration: 0,
                    roundDuration: 0,
                };
            }

            if (message._ === 'messageService') {
                const action = message.action._;

                if (!statData.servicesMessages[action]) {
                    statData.servicesMessages[action] = 0;
                }

                statData.servicesMessages[action]++;

                if (action === 'messageActionGroupCall' && message.action.duration) {
                    statData.callDuration += message.action.duration;
                }
            }

            if (message.media) {
                const type = message.media._;
                const isDocument = type === 'messageMediaDocument';
                const attributes = (isDocument && ((message.media.document && message.media.document.attributes) || [])) || []

                const sticker = attributes.find((attr) => attr._ === 'documentAttributeSticker');
                const voice = attributes.find((attr) => attr.voice);
                const round = attributes.find((attr) => attr.round_message);

                if (sticker) {
                    const stickerId = `${ message.media.document.id }_${ message.media.document.access_hash }`;

                    if (!statData.stickers[stickerId]) {
                        statData.stickers[stickerId] = 0;
                    }

                    peersData[peerId].stickers++;
                    statData.stickers[stickerId]++;
                    statData.stickersTotal++;
                } else if (voice) {
                    statData.voiceDuration += voice.duration;
                    peersData[peerId].voiceDuration += voice.duration;
                } else if (round) {
                    statData.roundDuration += round.duration;
                    peersData[peerId].roundDuration += round.duration;
                } else {
                    const attachType = message.media._.replace('messageMedia', '').toLowerCase();

                    if (!statData.attachmentsTypes[attachType]) {
                        statData.attachmentsTypes[attachType] = 0;
                    }

                    peersData[peerId].attachments++;

                    statData.attachmentsTypes[attachType]++;
                    statData.attachments++;
                }
            }

            if (message.entities) {
                message.entities.forEach(({ _, document_id }) => {
                    if (_ === 'messageEntityCustomEmoji') {
                        if (!statData.emoji[document_id]) {
                            statData.emoji[document_id] = 0;
                        }

                        peersData[peerId].emoji++;
                        statData.emoji[document_id]++;
                    }
                });
            }

            if (message.grouped_id) {
                if (groupedIds[message.grouped_id]) {
                    return; // skip duplicate
                }

                groupedIds[message.grouped_id] = true;
            }

            if (peerId !== lastPeerId) {
                statData.uniqCount++;
                peersData[peerId].uniqCount++;
                lastPeerId = peerId;
            }

            peersData[peerId].count++;
            statData.count++;
        });

        this.log('statData', statData);

        const usersDataArray = Object.keys(peersData).map((peerId) => {
            peersData[peerId].id = peerId;

            return peersData[peerId];
        });

        const getTop = (key) => {
            return usersDataArray
                .sort((a, b) => b[key] - a[key])
                .slice(0, 50)
                .filter(user => user[key]);
        };

        statData.tops = {
            count: getTop('count'),
            uniq_count: getTop('uniqCount'),
            emoji: getTop('emoji'),
            attachments: getTop('attachments'),
            stickers: getTop('stickers'),
            voice_duration: getTop('voiceDuration'),
            round_duration: getTop('roundDuration'),
        };

        Object.keys(statData.tops).forEach((key) => {
            if (!statData.tops[key].length) {
                delete statData.tops[key];
            }
        });

        this.setState({
            stat: statData,
            selectedTopTab: Object.keys(statData.tops)[0],
        });

        this.endProgress();
    };

    getSelectedPeriod = () => {
        const { stat } = this.state;

        if (!stat || !stat.firstMessage || !stat.lastMessage) {
            return null;
        }

        const start = this.moment(stat.firstMessage.date * 1000).format('DD.MM.YYYY');
        const end = this.moment(stat.lastMessage.date * 1000).format('DD.MM.YYYY');

        if (start === end) {
            return start;
        }

        return `${ start } - ${ end }`;
    };

    getTabsList = () => {
        const { stat } = this.state;

        if (!stat) {
            return [];
        }

        const keys = Object.keys(stat.tops);

        return keys.map((key, index) => {
            return {
                name: this.lang(`methods.dialogs_messages_stat.tops.${ key }`),
                // count: dialogs.chats.length,
                callback: () => {
                    this.setState({ selectedTopTab: key });
                }
            };
        });
    };

    getTabContent = () => {
        const { selectedTopTab, stat } = this.state;

        if (!selectedTopTab) {
            return null;
        }

        const peers = stat.tops[selectedTopTab];

        let formStatus = null;

        if (selectedTopTab === 'uniq_count') {
            formStatus = this.lang('methods.dialogs_messages_stat.uniq_description');
        }

        return (
            <>
                {
                    !!formStatus && <Div><FormStatus>{ formStatus }</FormStatus></Div>
                }

                {
                    peers.map((peer, key) => {
                        return this.getPeerRow({
                            peer: peer.id,
                            // callback: () => this.selectPeer(dialog),
                            description: this.getTabDescription(peer),
                        }, selectedTopTab + key);
                    })
                }
            </>
        );
    };

    getTabDescription = (peer) => {
        const { selectedTopTab } = this.state;
        const jsKey = selectedTopTab.replace(/_(\w)/g, (match, p1) => p1.toUpperCase());

        if (selectedTopTab.includes('duration')) {
            return this.helpers.getTextTime(peer[jsKey]);
        }

        const declineArray = this.lang(`methods.dialogs_messages_stat.decline.${ selectedTopTab }`);

        if (typeof declineArray !== 'string') {
            return this.helpers.declineAndFormat(peer[jsKey], declineArray);
        }

        return `${ peer[jsKey] } ${ selectedTopTab }`;
    };

    CountRow = (icon, count, decline, description) => {
        if (!count) {
            return null;
        }

        let text;

        if (decline === 'duration') {
            text = this.helpers.getTextTime(count);
        } else {
            text = this.helpers.declineAndFormat(count, decline);
        }

        return (
            <SimpleCell
                before={ icon }
                description={ description }
                disabled
            >{ text }</SimpleCell>
        );
    };

    content = () => {
        const { dialogs, selectedDialog, stat, periods } = this.state;

        if (stat) {
            return (
                <>
                    <Group>
                        {
                            this.getPeerRow({
                                peer: selectedDialog.peer,
                                description: this.lang('methods.dialogs_messages_stat.stat_date')
                                    .replace('{date}', this.getSelectedPeriod()),
                            })
                        }
                    </Group>

                    <Group>
                        {
                            this.CountRow(
                                <Icon28MessagesOutline />,
                                stat.count,
                                this.lang('methods.dialogs_messages_stat.decline.count')
                            )
                        }

                        {
                            this.CountRow(
                                <Icon28AttachOutline />,
                                stat.attachments,
                                this.lang('methods.dialogs_messages_stat.decline.attachments')
                            )
                        }

                        {
                            this.CountRow(
                                <Icon28StickerOutline />,
                                stat.stickersTotal,
                                this.lang('methods.dialogs_messages_stat.decline.stickers')
                            )
                        }

                        {
                            this.CountRow(
                                <Icon28VoiceOutline />,
                                stat.voiceDuration,
                                'duration',
                                this.lang('methods.dialogs_messages_stat.total_descriptions.voice')
                            )
                        }

                        {
                            this.CountRow(
                                <Icon28VideoOutline />,
                                stat.roundDuration,
                                'duration',
                                this.lang('methods.dialogs_messages_stat.total_descriptions.round')
                            )
                        }

                        {
                            this.CountRow(
                                <Icon28PhoneOutline />,
                                stat.callDuration,
                                'duration',
                                this.lang('methods.dialogs_messages_stat.total_descriptions.calls')
                            )
                        }
                    </Group>

                    <TabsList
                        tabs={ this.getTabsList() }
                        content={ this.getTabContent() }
                    />
                </>
            );
        }

        if (periods) {
            return (
                <>
                    <Group>
                        {
                            this.getPeerRow({
                                peer: selectedDialog.peer,
                            })
                        }
                    </Group>

                    <Group header={ <Header mode="secondary">{ this.lang('methods.dialogs_messages_stat.periods_header') }</Header> }>
                        {
                            periods.map(({ period, disabled, circa, count, periodDate }, key) => (
                                <SimpleCell
                                    key={ key }
                                    disabled={ disabled }
                                    before={ <Icon28CalendarOutline /> }
                                    style={{ opacity: disabled ? 0.5 : 1 }}
                                    subtitle={
                                        isNaN(count)
                                            ? this.lang('methods.dialogs_messages_stat.not_counted')
                                            : (circa ? '~' : '') + this.helpers.declineAndFormat(count, this.lang('methods.dialogs_messages_stat.decline.count'))
                                    }
                                    onClick={ () => this.calcStat(count, periodDate) }
                                >{ this.lang(`methods.dialogs_messages_stat.periods.${ period }`) }</SimpleCell>
                            ))
                        }
                    </Group>
                </>
            );
        }

        if (dialogs) {
            return (
                <Group>
                    {
                        dialogs.map((dialog, key) => {
                            return this.getPeerRow({
                                peer: dialog.peer,
                                callback: () => this.selectPeer(dialog),
                            }, key);
                        })
                    }
                </Group>
            );
        }
    };

}

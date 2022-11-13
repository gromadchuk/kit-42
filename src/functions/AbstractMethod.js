import React from 'react';

import * as moment from 'moment';

import { Div, Group, InfoRow, Placeholder, Progress, SimpleCell, Spinner } from '@vkontakte/vkui';
import { Icon12Verified, Icon56CheckCircleOutline, Icon56ErrorOutline } from '@vkontakte/icons';

import * as helpers from '../js/helpers';
import { lang } from '../js/lang';
import { MultiProgress } from '../components/MultiProgress';

import { AppContext } from '../js/AppContext';
import { UserAvatar } from '../components/UserAvatar';

export class AbstractMethod extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            progress: null,
            inlineProgress: false,
        };

        this.ownersInfo = {};

        this.lang = lang;
        this.moment = moment;
        this.log = helpers.dd;
        this.helpers = helpers;
    }

    componentDidMount = async () => {
        this.MTProto = this.context.MTProto;
        this.user = this.context.appState.user;

        this.beforeLogic();
    };

    beforeLogic = async () => {
        this.log('child class must override beforeLogic method');
    };

    initProgress = (text, total = 0) => {
        if (!text) {
            text = lang('app.loading');
        }

        this.setState({
            progress: {
                text,
                count: 0,
                total
            }
        });
    };

    setProgressTotal = (total) => {
        this.setState({
            progress: {
                ...this.state.progress,
                total
            }
        });
    };

    setProgressCount = (count) => {
        this.setState({
            progress: {
                ...this.state.progress,
                count
            }
        });
    };

    addProgressCount = (count) => {
        const progress = this.state.progress;

        progress.count += count;

        this.setState({ progress });
    };

    endProgress = () => {
        this.setState({
            progress: null
        });
    };

    initMultiProgress = (items) => {
        const lines = (items).map(([ name, total ], index) => {
            return {
                name,
                progress: 0,
                total,
                status: index === 0 ? 'loading' : 'wait'
            };
        });

        this.setState({
            multiProgress: {
                lines,
                currentIndex: 0
            }
        });
    };

    doneMultiProgressStep = () => {
        const multiProgress = this.state.multiProgress;

        if (!multiProgress) {
            return;
        }

        multiProgress.lines[multiProgress.currentIndex].status = 'done';

        multiProgress.currentIndex++;

        if (multiProgress.currentIndex < multiProgress.lines.length) {
            multiProgress.lines[multiProgress.currentIndex].status = 'loading';

            this.setState({ multiProgress });
        } else {
            this.endMultiProgress();
        }
    };

    setMultiProgressTotal = (total) => {
        const multiProgress = this.state.multiProgress;

        multiProgress.lines[multiProgress.currentIndex].total = total;

        this.setState({ multiProgress });
    };

    addMultiProgressCount = (count) => {
        const multiProgress = this.state.multiProgress;

        multiProgress.lines[multiProgress.currentIndex].progress =
            multiProgress.lines[multiProgress.currentIndex].progress + count;

        this.setState({ multiProgress });
    };

    endMultiProgress = () => {
        this.setState({ multiProgress: null });
    };

    getProgressText = () => {
        const { text, count, total } = this.state.progress;

        if (count && !total) {
            return `${ text } (${ helpers.formatNumber(count) })`;
        }

        if (total) {
            return `${ text } (${ helpers.formatNumber(count) } / ${ helpers.formatNumber(total) })`;
        }

        return text;
    };

    showMethodFinish = (text = null, status = true) => {
        this.endProgress();

        this.setState({
            finish: {
                icon: status
                    ? <Icon56CheckCircleOutline fill="var(--field_valid_border)" />
                    : <Icon56ErrorOutline fill="var(--field_error_border)" />,
                title: status ? lang('app.finish') : lang('app.error'),
                text: text || (status ? lang('app.finish') : lang('app.error'))
            }
        })
    };

    saveOwnersInfo = (...ownersParts) => {
        ownersParts.forEach((owners) => {
            owners.forEach((owner) => {
                this.ownersInfo[owner.id] = owner;
            });
        });
    };

    getPeerId = (owner) => {
        return owner.user_id || owner.channel_id || owner.chat_id || owner;
    };

    getOwnerInfo = (owner) => {
        return this.ownersInfo[this.getPeerId(owner)];
    };

    getPeerFormatted = (peer) => {
        const formatted = {
            ...peer,
            _: `inputPeer${ peer._.split('peer')[1] }`,
        };

        const accessId = peer.user_id || peer.channel_id;
        if (accessId) {
            const owner = this.ownersInfo[accessId];

            if (owner && owner.access_hash) {
                formatted.access_hash = owner.access_hash;
            }
        }

        return formatted;
    };

    getPeerRow = ({ peer, description, callback }, key) => {
        const peerId = peer.user_id || peer.channel_id || peer.chat_id || peer;
        const info = this.getOwnerInfo(peerId);

        info.peer = peer;

        const name = [
            info.first_name,
            info.last_name,
            info.title,
        ].join(' ');

        const props = {
            key,
            before: <UserAvatar size={ description ? 36 : 28 } { ...info } />,
            subtitle: description,
            badgeAfterTitle: info.verified && <Icon12Verified />,
        };

        if (callback) {
            props.onClick = () => callback();
        } else if (info.username) {
            props.href = `https://t.me/${ info.username }`;
            props.target = '_blank';
        } else if (info.id) {
            props.href = `https://t.me/c/${ info.id }/999999999`;
            props.target = '_blank';
        } else {
            props.disabled = true;
        }

        return (
            <SimpleCell { ...props }>{ name }</SimpleCell>
        );
    };

    getDialogs = async () => {
        this.initProgress(lang('app.loading_dialogs'));

        const params = {
            offset_peer: { _: 'inputPeerEmpty' },
            limit: 100,
        };

        const allDialogs = [];

        while (true) {
            const { count, chats, users, dialogs, messages } = await this.MTProto.call('messages.getDialogs', params);

            if (dialogs.length) {
                this.setProgressTotal(count || dialogs.length);
                await helpers.sleep(0); // strange fix collision with setState
                this.addProgressCount(dialogs.length);

                this.saveOwnersInfo(chats, users);

                allDialogs.push(...dialogs);

                params.offset_date = messages[messages.length - 1].date;

                if (dialogs.length < params.limit) {
                    break;
                }
            } else {
                break;
            }
        }

        const filtered = allDialogs.filter((dialog) => {
            const owner = this.getOwnerInfo(dialog.peer);

            if (owner && owner.migrated_to) {
                this.log('filter migrate owner', owner);

                return false;
            }

            return true;
        });

        this.endProgress();

        return filtered;
    };

    ProgressBlock = () => {
        const { progress } = this.state;

        if (!progress) {
            return null;
        }

        if (progress.text === lang('app.loading')) {
            return (
                <Group>
                    <Div style={{ height: 105 }}>
                        <Spinner />
                    </Div>
                </Group>
            );
        }

        return (
            <Group>
                <Div>
                    <InfoRow header={ this.getProgressText() }>
                        <Progress value={ helpers.getProgressCount(this.state.progress.count, this.state.progress.total)} />
                    </InfoRow>
                </Div>
            </Group>
        );
    };

    render() {
        const { progress, inlineProgress, finish, multiProgress } = this.state;

        if (finish) {
            return (
                <Group>
                    <Placeholder
                        icon={ finish.icon }
                        title={ finish.title }
                    >{ !!finish.text && finish.text }</Placeholder>
                </Group>
            );
        }

        if (progress && !inlineProgress) {
            return this.ProgressBlock();
        }

        if (multiProgress) {
            return (
                <Group>
                    <MultiProgress options={ multiProgress } />
                </Group>
            );
        }

        return (
            <>
                { progress && this.ProgressBlock() }

                { this.content() }
            </>
        );
    }

}

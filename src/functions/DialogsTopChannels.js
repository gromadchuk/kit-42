import { AbstractMethod } from './AbstractMethod';

import { Placeholder } from '@vkontakte/vkui';

import { TabsList } from '../components/TabsList';

export class DialogsTopChannels extends AbstractMethod {

    beforeLogic = async () => {
        const dialogs = await this.getDialogs();
        const channels = dialogs.filter((dialog) => {
            const peer = this.getOwnerInfo(dialog.peer);

            if (peer && peer.participants_count) {
                return true;
            }

            return false;
        });

        const data = {
            chats: [],
            channels: [],
        };

        channels.forEach((dialog) => {
            const peer = this.getOwnerInfo(dialog.peer);

            dialog.participants_count = peer.participants_count;

            if (peer.megagroup) {
                data.chats.push(dialog);
            } else if (dialog.peer.channel_id) {
                data.channels.push(dialog);
            } else {
                console.log('unknown type', dialog);
            }
        });

        this.setState({ dialogs: data });
    };

    getTabContent = () => {
        const selectedTab = this.state.selectedTab || 'chats';
        const dialogs = this.state.dialogs[selectedTab];

        if (!dialogs.length) {
            return (
                <Placeholder>
                    { this.lang('methods.dialogs_top_channels.no_dialogs') }
                </Placeholder>
            );
        }



        const sortedDialogs = dialogs.sort((a, b) => {
            if (selectedTab === 'chats') {
                return b.top_message - a.top_message;
            }

            return b.participants_count - a.participants_count;
        });

        return sortedDialogs.map((dialog, key) => {
            const description = selectedTab === 'chats'
                ? this.helpers.declineAndFormat(
                    dialog.top_message,
                    this.lang('methods.dialogs_top_channels.messages')
                )
                : this.helpers.declineAndFormat(
                    dialog.participants_count,
                    this.lang('methods.dialogs_top_channels.members')
                )

            return this.getPeerRow({
                peer: dialog.peer,
                description,
            }, selectedTab + key);
        });
    };

    content = () => {
        const { dialogs } = this.state;

        if (dialogs) {
            const tabs = [{
                name: this.lang('methods.dialogs_top_channels.tab_chats'),
                count: dialogs.chats.length,
                callback: () => {
                    this.setState({ selectedTab: 'chats' });
                }
            }, {
                name: this.lang('methods.dialogs_top_channels.tab_channels'),
                count: dialogs.channels.length,
                callback: () => {
                    this.setState({ selectedTab: 'channels' });
                }
            }];

            return (
                <TabsList
                    tabs={ tabs }
                    content={ this.getTabContent() }
                />
            );
        }
    };

}

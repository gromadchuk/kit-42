import { AbstractMethod } from './AbstractMethod';

import { Div, Button, Group, Header } from '@vkontakte/vkui';

export class DialogsRead extends AbstractMethod {

    beforeLogic = async () => {
        const dialogs = await this.getDialogs();
        const unreadDialogs = dialogs.filter(dialog => dialog.unread_count > 0);

        if (!unreadDialogs.length) {
            return this.showMethodFinish(this.lang('methods.dialogs_read.no_dialogs'), this);
        }

        this.setState({ dialogs: unreadDialogs });
    };

    confirm = async () => {
        this.setState({ isLoading: true });

        const { dialogs } = this.state;

        while (dialogs.length) {
            const dialog = dialogs.pop();
            const peer = this.getPeerFormatted(dialog.peer);

            if (peer.channel_id) {
                await this.MTProto.call('channels.readHistory', {
                    channel: peer
                });
            } else {
                await this.MTProto.call('messages.readHistory', {
                    peer
                });
            }

            this.setState({ dialogs });
        }

        this.showMethodFinish();
    };

    content = () => {
        const { dialogs, isLoading } = this.state;

        if (dialogs) {
            return (
                <Group header={
                    <Header mode="secondary">
                        { this.lang('methods.dialogs_read.dialogs') }
                    </Header>
                }>
                    <Div
                        style={{
                            textAlign: 'center',
                            fontSize: '4em'
                        }}
                    >{ this.helpers.formatNumber(dialogs.length) }</Div>

                    <Div>
                        <Button
                            disabled={ isLoading }
                            loading={ isLoading }
                            stretched
                            size="l"
                            onClick={ this.confirm }
                        >{ this.lang('methods.dialogs_read.read_dialogs') }</Button>
                    </Div>
                </Group>
            );
        }
    };

}

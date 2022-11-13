import { AbstractMethod } from './AbstractMethod';

import { Div, Button, Group, Header } from '@vkontakte/vkui';

export class AccountClearStickers extends AbstractMethod {

    beforeLogic = async () => {
        this.initProgress();

        const { sets: stickers } = await this.MTProto.call('messages.getAllStickers');

        if (!stickers.length) {
            return this.showMethodFinish(this.lang('methods.account_clear_stickers.not_found'), true);
        }

        this.setState({
            stickers,
            isLoading: false,
        });

        this.endProgress();
    };

    confirm = async () => {
        this.setState({ isLoading: true });

        const { stickers } = this.state;

        while (stickers.length) {
            const sticker = stickers.pop();

            await this.MTProto.call('messages.uninstallStickerSet', {
                stickerset: {
                    _: 'inputStickerSetID',
                    id: sticker.id,
                    access_hash: sticker.access_hash
                }
            });

            this.setState({ stickers });
        }

        this.showMethodFinish();
    };

    content = () => {
        const { stickers, isLoading } = this.state;

        if (stickers) {
            return (
                <Group header={
                    <Header mode="secondary">
                        { this.lang('methods.account_clear_stickers.stickers') }
                    </Header>
                }>
                    <Div
                        style={{
                            textAlign: 'center',
                            fontSize: '4em'
                        }}
                    >{ this.helpers.formatNumber(stickers.length) }</Div>

                    <Div>
                        <Button
                            disabled={ isLoading }
                            loading={ isLoading }
                            stretched
                            size="l"
                            onClick={ this.confirm }
                        >{ this.lang('methods.account_clear_stickers.clear_stickers') }</Button>
                    </Div>
                </Group>
            );
        }
    };

}

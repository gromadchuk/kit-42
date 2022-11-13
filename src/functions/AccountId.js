import { AbstractMethod } from './AbstractMethod';

import { FormLayout, Input, Div, Button, FormItem, Group, SimpleCell } from '@vkontakte/vkui';
import { Icon16Verified } from '@vkontakte/icons';
import { UserAvatar } from '../components/UserAvatar';

export class AccountId extends AbstractMethod {

    beforeLogic = async () => {
        const user = this.context.appState.user;

        if (user.username) {
            this.setState({ username: user.username });
        }
    };

    checkUsername = async () => {
        const { username } = this.state;

        this.setState({
            owner: null,
            isLoading: true,
        });

        const usernameParse = username.match(/(^|(https:\/\/)?t\.me\/|@)(\w+)$/);

        if (!usernameParse) {
            this.setState({
                error: this.lang('methods.account_id.unknown_owner')
            });
            return;
        }

        const { error_message, users, chats, peer } = await this.MTProto.call('contacts.resolveUsername', {
            username: usernameParse[3]
        });

        this.setState({
            isLoading: false,
        });

        if (error_message) {
            this.setState({
                error: this.MTProto.getError(error_message)
            });
        } else {
            if (users.length) {
                const [user] = users;

                this.setState({
                    owner: {
                        id: user.id,
                        name: `${ user.first_name || '' } ${ user.last_name || '' }`,
                        verified: user.verified,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        photo: user.photo,
                        access_hash: user.access_hash,
                        peer,
                    }
                });
            } else if (chats.length) {
                const [chat] = chats;

                this.setState({
                    owner: {
                        id: chat.id,
                        name: chat.title,
                        verified: chat.verified,
                        first_name: chat.title,
                        last_name: '',
                        photo: chat.photo,
                        access_hash: chat.access_hash,
                        peer,
                    }
                });
            } else {
                this.setState({
                    error: this.lang('methods.account_id.unknown_owner')
                });
            }
        }
    };

    VerifyIcon = () => {
        const { owner } = this.state;

        if (!owner || !owner.verified) {
            return null;
        }

        return <Icon16Verified />;
    };

    content = () => {
        const { owner, username, error, isLoading } = this.state;

        return (
            <Group>
                <FormLayout>
                    <FormItem
                        status={ error ? 'error' : null }
                        bottom={ error }
                    >
                        <Input
                            type="text"
                            placeholder="@kit42_app"
                            defaultValue={ username }
                            onChange={ (e) => {
                                if (error) {
                                    this.setState({ error: null });
                                }

                                this.setState({
                                    username: e.target.value
                                });
                            } }
                        />
                    </FormItem>
                </FormLayout>

                <Div>
                    <Button
                        size="l"
                        stretched
                        loading={ isLoading }
                        disabled={ isLoading || (username || '').length < 5 }
                        onClick={ this.checkUsername }
                    >{ this.lang('methods.account_id.button_get') }</Button>
                </Div>

                {
                    !!owner &&
                    <>
                        <FormLayout>
                            <SimpleCell
                                disabled
                                before={ <UserAvatar size={ 28 } { ...owner } /> }
                                badgeAfterTitle={ this.VerifyIcon() }
                            >
                                { owner.name }
                            </SimpleCell>
                            <FormItem>
                                <Input type="text" value={ owner.id } readOnly={ true } />
                            </FormItem>
                        </FormLayout>
                    </>
                }
            </Group>
        );
    };

}

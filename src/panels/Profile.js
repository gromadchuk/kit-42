import React from 'react';

import localforage from 'localforage';

import { CellButton, Spacing, Title, Div, Header, Tabs, TabsItem } from '@vkontakte/vkui';
import { Icon28UserOutgoingOutline } from '@vkontakte/icons';

import { UserAvatar } from '../components/UserAvatar';

import { AppContext } from '../js/AppContext';

import { lang } from '../js/lang';
import { getDefaultTheme, setTheme } from '../js/helpers';

export class Profile extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            tabActive: 'light',
        };
    }

    componentDidMount = async () => {
        const theme = (await localforage.getItem('theme')) || getDefaultTheme();

        this.setState({
            tabActive: theme,
        });
    };

    changeAppTheme = async (theme) => {
        this.setState({ tabActive: theme });
        await localforage.setItem('theme', theme);
        setTheme(theme);
    };

    AppTheme = () => {
        const { tabActive } = this.state;

        return (
            <>
                <Header mode="secondary">{ lang('profile.theme.title') }</Header>

                <Tabs>
                    <TabsItem
                        selected={ tabActive === 'dark' }
                        onClick={() => {
                            this.changeAppTheme('dark');
                        }}
                    >
                        { lang('profile.theme.dark') }
                    </TabsItem>
                    <TabsItem
                        selected={ tabActive === 'light' }
                        onClick={() => {
                            this.changeAppTheme('light');
                        }}
                    >
                        { lang('profile.theme.light') }
                    </TabsItem>
                </Tabs>
            </>
        );
    };

    logout = async () => {
        this.context.openContent('loading');

        await this.context.MTProto.call('auth.logOut');

        this.context.checkUser();
    };

    profileStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 32
    };

    render() {
        const { user } = this.context.appState;

        return (
            <>
                <Div style={ this.profileStyles }>
                    <UserAvatar size={ 72 } { ...user } />
                    <Title
                        style={{ marginBottom: 8, marginTop: 20 }}
                        level="2"
                        weight="2"
                    >
                        { user.first_name } { user.last_name }
                    </Title>
                </Div>

                { this.AppTheme() }

                <Spacing />

                <CellButton
                    before={ <Icon28UserOutgoingOutline /> }
                    mode="danger"
                    onClick={ this.logout }
                >
                    { lang('profile.logout') }
                </CellButton>
            </>
        );
    }

}

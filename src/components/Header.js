import { Component } from 'react';

import { PanelHeader, PanelHeaderButton, Link } from '@vkontakte/vkui';
import { Icon24Back } from '@vkontakte/icons';

import { UserAvatar } from './UserAvatar';
import { Logo } from './Logo';

import { AppContext } from '../js/AppContext';
import { lang } from '../js/lang';

export class Header extends Component {
    static contextType = AppContext;

    render() {
        const props = {
            className: 'kit-header',
        };

        let content = <Logo size={ 1 } />;

        if (this.context.appState.user) {
            props.after = (
                <PanelHeaderButton
                    onClick={ () => {
                        this.context.openContent('profile');
                    } }
                    aria-label={ lang('profile.title ') }
                >
                    <UserAvatar size={ 36 } { ...this.context.appState.user } />
                </PanelHeaderButton>
            );
        }

        const { activeContent } = this.context.appState;

        if (!['auth', 'home', 'loading'].includes(activeContent)) {
            content = (
                <Link onClick={ () => {
                    this.context.openContent('home');
                } }>
                    <Logo size={ 1 } />
                </Link>
            );

            props.before = (
                <PanelHeaderButton onClick={ this.context.backButton } aria-label={ lang('app.back') }>
                    <Icon24Back />
                </PanelHeaderButton>
            );
        }

        return (
            <PanelHeader { ...props }>{ content }</PanelHeader>
        );
    }

}

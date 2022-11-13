import { Component, createElement } from 'react';

import { Footer as VKUIFooter, Link, SimpleCell } from '@vkontakte/vkui';
import { Icon16Like, Icon16LikeOutline } from '@vkontakte/icons';

import { AppContext } from '../js/AppContext';
import { allowLangs, getLangCode, lang } from '../js/lang';

const ENFlag = require('../images/flags/en.png');
const UKFlag = require('../images/flags/uk.png');
const RUFlag = require('../images/flags/ru.png');

const aliasIcons = {
    en: ENFlag,
    uk: UKFlag,
    ru: RUFlag,
};

const aliasNames = {
    en: 'English',
    uk: 'Українська',
    ru: 'Русский',
};

export class Footer extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            clicks: 0,
            langCode: getLangCode(),
        };
    }

    LangIcons = () => {
        const { langCode } = this.state;

        return (
            <div
                style={{ display: 'inline' }}
                onClick={ () => {
                    this.context.showModal('custom', {
                        header: lang('app.lang'),
                        content: allowLangs.map((lang, key) => (
                            <SimpleCell
                                key={ key }
                                onClick={ () => {
                                    localStorage.setItem('lang', lang);
                                    window.location.reload();
                                } }
                                before={
                                    <img
                                        src={ aliasIcons[lang] }
                                        alt="lang"
                                        style={{
                                            width: 28,
                                            marginRight: 10,
                                        }}
                                    />
                                }
                            >
                                { aliasNames[lang] }
                            </SimpleCell>
                        ))
                    });
                } }
            >
                <img
                    src={ aliasIcons[langCode] }
                    alt="lang"
                    style={{
                        width: 15,
                        marginLeft: 5,
                        marginBottom: -4,
                        cursor: 'pointer',
                    }}
                />
            </div>
        );
    };

    render() {
        const { clicks } = this.state;

        const likeIcon = clicks % 2 ? Icon16Like : Icon16LikeOutline;
        const iconTag = createElement(likeIcon, {
            className: 'FooterIcon',
            fill: clicks % 2 ? 'var(--destructive)' : null,
            style: {
                display: 'inline-block',
                marginBottom: -3,
            }
        });

        return (
            <VKUIFooter onClick={ () => this.setState({ clicks: clicks + 1 }) }>
                Made with { iconTag } by <Link target="_blank" href="https://t.me/kit42_app">Kit 42</Link> team |
                <this.LangIcons />
            </VKUIFooter>
        );
    }

}

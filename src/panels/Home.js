import React, { Component } from 'react';

import { Header, SimpleCell, Banner, Button } from '@vkontakte/vkui';

import { AppContext } from '../js/AppContext';
import { getBlockMethods, getBlocks } from '../methods';
import { lang } from '../js/lang';

export class Home extends Component {
    static contextType = AppContext;

    FunctionRow = (method, key) => {
        return (
            <SimpleCell
                key={ key }
                onClick={ () => this.context.openMethod(method) }
                before={ method.icon }
            >{ method.name }</SimpleCell>
        );
    };

    Button = (link, text) => {
        return (
            <Button
                href={ link }
                target="_blank"
            >{ text }</Button>
        );
    };

    render() {
        const blocks = getBlocks();

        return (
            <>
                <Banner
                    header={ lang('app.alpha.title') }
                    subheader={ lang('app.alpha.description') }
                    actions={
                        <React.Fragment>
                            { this.Button('https://t.me/gromadchuk', lang('app.alpha.button_dev')) }
                        </React.Fragment>
                    }
                />

                {
                    blocks.map(({ id, title, icon }, key) => {
                        const methods = getBlockMethods(id);

                        return (
                            <div key={ key }>
                                <Header mode="secondary">{ title }</Header>

                                { methods.map(this.FunctionRow) }
                            </div>
                        );
                    })
                }
            </>
        );
    }

}

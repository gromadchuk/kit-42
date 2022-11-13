import React from 'react';

import { Group, HorizontalScroll, TabsItem, Tabs, Counter, Header } from '@vkontakte/vkui';

const duration = 300;

export class TabsList extends React.Component {

    constructor(props) {
        super(props);

        this.tabId = `tabs${ (Math.random() * 2e17).toString() }`;

        this.state = {
            selectedTabIndex: 0
        };
    }

    scrollMenu = () => {
        const menu = document.querySelector(`#${ this.tabId } .HorizontalScroll__in`);
        const item = document.querySelector(`#${ this.tabId } .TabsItem--selected`);

        if (item != null) {
            const scrollToOffset = item.offsetLeft - menu.offsetWidth / 2 + item.offsetWidth / 2;
            const start = menu.scrollLeft;
            const change = scrollToOffset - start;
            const increment = 20;
            let currentTime = 0;

            const animateScroll = () => {
                currentTime += increment;

                menu.scrollLeft = ((t, b, c, d) => {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                })(currentTime, start, change, duration);

                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };

            animateScroll();
        }
    };

    render() {
        return (
            <Group
                id={ this.tabId }
                header={
                    this.props.title &&
                    <Header mode="secondary" aside={ this.props.aside }>{ this.props.title }</Header>
                }
            >
                <Tabs mode="accent">
                    <HorizontalScroll showArrows={ false }>
                        {
                            this.props.tabs.map((tab, index) => (
                                <TabsItem
                                    key={ index }
                                    onClick={ () => {
                                        this.setState({ selectedTabIndex: index });

                                        tab.callback();

                                        setTimeout(() => {
                                            this.scrollMenu();
                                        }, 0)
                                    } }
                                    selected={ this.state.selectedTabIndex === index }
                                    after={ tab.count !== undefined ? <Counter size="s">{ tab.count }</Counter> : null }
                                >{ tab.name }</TabsItem>
                            ))
                        }
                    </HorizontalScroll>
                </Tabs>

                { this.props.content }
            </Group>
        );
    }

}

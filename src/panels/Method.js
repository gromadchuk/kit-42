import { Component, createElement } from 'react';

import { AppContext } from '../js/AppContext';

export class Method extends Component {
    static contextType = AppContext;

    render() {
        return createElement(this.context.appState.selectedMethod.component, this.props);
    }

}

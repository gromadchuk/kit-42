import { Component, createRef } from 'react';

import { Avatar, InitialsAvatar } from '@vkontakte/vkui';

import { AppContext } from '../js/AppContext';
import { isInViewport } from '../js/helpers';

export class UserAvatar extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            photo: null,
        };

        this.ref = createRef();
    }

    divStyle = {
        marginRight: 10,
    }

    componentDidMount() {
        const { id, photo } = this.props;

        const avatars = this.context.appState.avatars;
        if (!avatars[id] && photo && photo.photo_id) {
            this.waitVisibleAvatarAndLoad();
        }
    }

    componentWillUnmount() {
        if (this.checkVisible) {
            clearInterval(this.checkVisible);
        }
    }

    waitVisibleAvatarAndLoad = () => {
        const { size, id, photo, access_hash, peer } = this.props;

        this.checkVisible = setInterval(() => {
            const isVisible = isInViewport(this.ref.current, size);

            if (isVisible) {
                clearInterval(this.checkVisible);

                this.context.loadAvatar({ id, photo, access_hash, peer });
            }
        }, 100);
    };

    render() {
        const { size, id, first_name, last_name, mode, title } = this.props;

        const avatars = this.context.appState.avatars;
        const userAvatar = avatars[id];

        if (userAvatar) {
            return (
                <Avatar
                    size={ size }
                    src={ avatars[id] }
                    mode={ mode }
                />
            );
        }

        const strFirstTitle = (title && title[0]) || '';
        const strFirstName = (first_name && first_name[0]) || '';
        const strLastName = (last_name && last_name[0]) || '';
        const strFirstLastName = strFirstName + strLastName + strFirstTitle;

        return (
            <div ref={ this.ref } style={ this.divStyle }>
                <InitialsAvatar
                    size={ size }
                    gradientColor={ (id % 6) + 1 }
                    mode={ mode }
                >{ strFirstLastName }</InitialsAvatar>
            </div>
        );
    }

}

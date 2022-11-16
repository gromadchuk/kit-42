import { Component } from 'react';

import localforage from 'localforage';
import ReactGA from 'react-ga4';

import {
    Avatar,
    View,
    Panel,
    Placeholder,
    Spinner,
    Group,
    Snackbar,
    Button,
    ActionSheet,
    ActionSheetItem,
    ModalRoot,
    PopoutWrapper,
    CardGrid,
    Card,
} from '@vkontakte/vkui';
import { Icon16Done, Icon16ErrorCircleOutline } from '@vkontakte/icons';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { Auth } from './panels/Auth';
import { Home } from './panels/Home';
import { Profile } from './panels/Profile';
import { Method } from './panels/Method';

import { CustomModal } from './modals/CustomModal';

import { MTProto } from './js/mtproto';
import { AppContext } from './js/AppContext';
import { dd, declineAndFormat, getDefaultTheme, linkProps, setTheme, sleep } from './js/helpers';
import { Cache } from './js/cache';
import { lang } from './js/lang';
import { Buffer } from 'buffer';
import { getAllMethods } from './methods';

export class App extends Component {

    constructor(props) {
        super(props);

        ReactGA.initialize('G-T5H886J9RS');

        this.state = {
            activeContent: 'loading',
            avatars: {},
            user: null,
            modalsHistory: [],
        };

        this.initHash = window.location.hash.replace('#/', '');
        this.avatars = {}; // very need crutch

        this.allowHash = [
            'profile',
            'home',
        ];

        this.allowMethodsHash = getAllMethods().map(method => method.id);

        window.userId = 0; // for cache

        this.cache = new Cache();

        this.isLoadingAvatars = false;
    }

    queueAvatars = [];

    componentDidMount = async () => {
        this.MTProto = new MTProto({
            showWaitPopout: this.showWaitPopout.bind(this),
        });

        const theme = (await localforage.getItem('theme')) || getDefaultTheme();

        setTheme(theme);

        await sleep(300);

        await this.MTProto.checkDc();

        this.checkUser();
    };

    checkUser = async () => {
        const { full_user, users, error_message } = await this.MTProto.call('users.getFullUser', {
            id: {
                _: 'inputUserSelf'
            }
        });

        if (error_message === 'AUTH_KEY_UNREGISTERED') {
            this.openContent('auth');
        } else {
            const user = users.find(user => user.id === full_user.id);

            window.userId = user.id;

            this.setState({ user });

            if (this.allowMethodsHash.includes(this.initHash)) {
                const method = getAllMethods().find(method => method.id === this.initHash);

                this.openMethod(method);
            } else if (this.allowHash.includes(this.initHash)) {
                this.openContent(this.initHash);
            } else {
                this.openContent('home');
            }
        }
    };

    loadAvatar = async (owner) => {
        if (!owner.photo || this.state.avatars[owner.id] || this.queueAvatars.find(queueUser => queueUser.id === owner.id)) {
            return;
        }

        this.queueAvatars.push(owner);

        if (!this.isLoadingAvatars) {
            this.loadAvatarBytes();
        }
    };

    loadAvatarBytes = async () => {
        if (!this.queueAvatars.length) {
            this.isLoadingAvatars = false;

            return;
        }

        this.isLoadingAvatars = true;

        const user = this.queueAvatars.shift();

        const currentAvatars = this.avatars;
        const localCacheKey = `avatar_${ user.id }_${ user.photo.photo_id }`;
        const localPhoto = await this.cache.getOnlyCache(localCacheKey);

        if (localPhoto) {
            currentAvatars[user.id] = localPhoto;

            this.setState({
                avatars: { ...currentAvatars },
            });

            this.loadAvatarBytes();
        } else {
            let peer = {
                _: 'inputPeerUser',
                user_id: user.id,
                access_hash: user.access_hash,
            };

            if (user.peer && user.peer._) {
                peer._ = `inputPeer${ user.peer._.split('peer')[1] }`;

                delete user.peer._;

                peer = {
                    ...peer,
                    ...user.peer,
                };
            }

            const { bytes, error_message } = await this.MTProto.call('upload.getFile', {
                location: {
                    _: 'inputPeerPhotoFileLocation',
                    peer,
                    photo_id: user.photo.photo_id,
                },
                offset: 0,
                limit: 1024 * 1024
            }, {
                dcId: user.photo.dc_id
            });

            if (error_message && error_message.includes('FLOOD_WAIT')) {
                const seconds = parseInt(error_message.split('_')[2]);

                this.queueAvatars.unshift(user);

                setTimeout(this.loadAvatarBytes, seconds * 1000);
            } else {
                try {
                    currentAvatars[user.id] = `data:image/jpeg;base64,${ Buffer.from(bytes).toString('base64') }`;
                    this.avatars[user.id] = currentAvatars[user.id];

                    this.setState({
                        avatars: { ...currentAvatars },
                    });

                    this.cache.set(localCacheKey, currentAvatars[user.id], 60 * 24 * 2);
                } catch (error) {
                    dd(error);
                }

                this.loadAvatarBytes();
            }
        }
    };

    backButton = () => {
        this.openContent('home');
    };

    Content = () => {
        const { activeContent } = this.state;

        if (activeContent === 'loading') {
            return (
                <Group>
                    <Placeholder>
                        <Spinner />
                    </Placeholder>
                </Group>
            );
        }

        if (activeContent === 'auth') {
            return (
                <Group>
                    <Auth />
                </Group>
            );
        }

        if (activeContent === 'home') {
            return (
                <Group>
                    <Home />
                </Group>
            );
        }

        if (activeContent === 'profile') {
            return (
                <Group>
                    <Profile />
                </Group>
            );
        }

        if (activeContent === 'method') {
            return <Method />;
        }

        return (
            <Group>
                <Placeholder
                    header="This should not be visible - write t.me/gromadchuk"
                    action={ <Button size="m" { ...linkProps('https://t.me/gromadchuk') }>t.me/gromadchuk</Button> }
                />
            </Group>
        );
    };

    showSnackbar = (text, status) => {
        this.setState({
            snackbar: (
                <Snackbar
                    onClose={ () => this.setState({ snackbar: null }) }
                    duration={ 3000 }
                    before={
                        <Avatar size={ 24 } style={ {
                            background: status ? 'var(--button_commerce_background)' : 'var(--destructive)'
                        } }>
                            {
                                status
                                    ? <Icon16Done fill="#fff" width={ 14 } height={ 14 } />
                                    : <Icon16ErrorCircleOutline fill="#fff" width={ 14 } height={ 14 } />
                            }

                        </Avatar>
                    }
                >{ text }</Snackbar>
            ),
        });
    };

    showActionSheet = (items) => {
        this.setState({
            popout: (
                <ActionSheet
                    onClose={ this.popoutClose }
                    iosCloseItem={
                        <ActionSheetItem autoclose mode="cancel">
                            { lang('app.cancel') }
                        </ActionSheetItem>
                    }
                >
                    {
                        items.map(({ name, mode, callback }, key) => (
                            <ActionSheetItem
                                key={ key }
                                autoclose
                                mode={ mode }
                                onClick={ callback }
                            >{ name }</ActionSheetItem>
                        ))
                    }
                </ActionSheet>
            )
        });
    };

    showWaitPopout = (seconds) => {
        let secondsLeft = 0;

        dd('showWaitPopout', seconds);

        const updateText = () => {
            const waitSeconds = seconds - secondsLeft;
            const waitPopoutText = lang('app.wait_error')
                .replace('{time}', declineAndFormat(waitSeconds, lang('app.wait_error_seconds')));

            this.setState({
                popout: (
                    <PopoutWrapper alignY="center" alignX="center">
                        <CardGrid size="l">
                            <Card>
                                <Placeholder icon={ <Spinner /> }>
                                    { waitPopoutText }
                                </Placeholder>
                            </Card>
                        </CardGrid>
                    </PopoutWrapper>
                )
            });
        };

        updateText();

        const updateJob = setInterval(() => {
            secondsLeft += 1;

            updateText();

            if (secondsLeft >= seconds) {
                clearInterval(updateJob);
                this.popoutClose();
            }
        }, 1000);
    }

    popoutClose = () => {
        this.setState({ popout: null });
    };

    openContent = (contentId) => {
        window.location.hash = `/${ contentId }`;
        ReactGA.send({ hitType: 'pageview', page: `/${ contentId }` });

        this.setState({
            activeContent: contentId,
        });
    };

    openMethod = (method) => {
        window.location.hash = `/${ method.id }`;
        ReactGA.send({ hitType: 'pageview', page: `/${ method.id }` });

        this.setState({
            activeContent: 'method',
            selectedMethod: method,
        });
    };

    showModal = (activeModal, modalData = {}) => {
        const { modalsHistory } = this.state;

        modalsHistory.push(activeModal);

        this.setState({
            activeModal,
            modalsHistory,
            modalData
        });
    };

    onModalClose = () => {
        const { modalsHistory } = this.state;

        modalsHistory.pop() // remove current modal

        if (modalsHistory.length) {
            const activeModal = modalsHistory[modalsHistory.length - 1];

            this.setState({
                activeModal,
                modalsHistory,
            });
        } else {
            this.setState({
                activeModal: null,
            });
        }
    };

    getContext = () => {
        return {
            MTProto: this.MTProto,
            appState: this.state,
            setAppState: this.setState.bind(this),
            loadAvatar: this.loadAvatar.bind(this),
            showSnackbar: this.showSnackbar.bind(this),
            showActionSheet: this.showActionSheet.bind(this),
            openContent: this.openContent.bind(this),
            openMethod: this.openMethod.bind(this),
            checkUser: this.checkUser.bind(this),
            backButton: this.backButton.bind(this),
            showModal: this.showModal.bind(this),
        };
    };

    render() {
        const { snackbar, popout, activeModal, modalData } = this.state;

        const commonModalProps = {
            modalData,
            onClose: this.onModalClose.bind(this),
        };

        const modal = (
            <ModalRoot activeModal={ activeModal } onClose={ this.onModalClose.bind(this) }>
                <CustomModal id="custom" { ...commonModalProps } />
            </ModalRoot>
        );

        return (
            <AppContext.Provider value={ this.getContext() }>
                <View activePanel="app" popout={ popout } modal={ modal }>
                    <Panel id="app">
                        <Header />

                        <div className="main-layout">
                            { this.Content() }
                        </div>

                        <Footer />

                        { snackbar }
                    </Panel>
                </View>
            </AppContext.Provider>
        );
    }

}

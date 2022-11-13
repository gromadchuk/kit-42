import { AbstractMethod } from './AbstractMethod';

import { Group, Header, CellButton } from '@vkontakte/vkui';
import { Icon24Users3Outline } from '@vkontakte/icons';
import moment from 'moment/moment';

export class ContactsAnalysis extends AbstractMethod {

    beforeLogic = async () => {
        this.initProgress();

        const { users } = await this.MTProto.callWithCache('contacts','contacts.getContacts');

        if (!users.length) {
            return this.showMethodFinish(this.lang('methods.contacts_analysis.not_found'), false);
        }

        this.saveOwnersInfo(users);

        const premiumUsers = users.filter(({ premium }) => premium);
        const mutualUsers = users.filter(({ mutual_contact }) => mutual_contact);
        const nonMutualUsers = users.filter(({ mutual_contact }) => !mutual_contact);
        const withoutPhotoUsers = users.filter(({ photo }) => !photo);
        const verifiedUsers = users.filter(({ verified }) => verified);
        const withoutPhoneUsers = users.filter(({ phone }) => !phone);
        const withoutUsernameUsers = users.filter(({ username }) => !username);
        const deletedUsers = users.filter(({ deleted }) => deleted);
        const longTimeOnlineUsers = users.filter(({ status }) => !status);

        const hideOnlineUsers = users
            .filter(({ status }) => status && status._ === 'userStatusRecently');

        const recentOnlineUsers = users
            .filter(({ status }) => status && status._ === 'userStatusOffline')
            .filter(({ status }) => moment().diff(status.was_online * 1000) > 60 * 60 * 24 * 3 * 1000)
            .sort((a, b) => a.status.was_online - b.status.was_online);

        const oldUsers = users
            .filter(({ id }) => +id < 100_000_000) // first 100m
            .sort((a, b) => +a.id - +b.id);

        this.endProgress();

        this.setState({
            contacts: {
                premiumUsers,
                oldUsers,
                mutualUsers,
                nonMutualUsers,
                withoutPhotoUsers,
                verifiedUsers,
                withoutPhoneUsers,
                withoutUsernameUsers,
                deletedUsers,
                longTimeOnlineUsers,
                hideOnlineUsers,
                recentOnlineUsers,
            }
        });
    };

    getTitle = (type) => {
        const alias = {
            premiumUsers: 'premium',
            oldUsers: 'old',
            mutualUsers: 'mutual',
            nonMutualUsers: 'non_mutual',
            withoutPhotoUsers: 'without_photo',
            verifiedUsers: 'verified',
            withoutPhoneUsers: 'without_phone',
            withoutUsernameUsers: 'without_username',
            deletedUsers: 'deleted',
            longTimeOnlineUsers: 'long_time_online',
            hideOnlineUsers: 'hide_online',
            recentOnlineUsers: 'recent_online',
        };

        return this.lang(`methods.contacts_analysis.headers.${ alias[type] || type }`);
    };

    getDescription = (type, user) => {
        if (type === 'oldUsers') {
            return `id: ${ user.id }`
        }


        if (type === 'recentOnlineUsers') {
            return moment(user.status.was_online * 1000).fromNow();
        }

        return null;
    };

    UserRow = (user, type, key) => {
        if (!user.first_name && !user.last_name) {
            user.first_name = 'NO_NAME';
        }

        return this.getPeerRow({
            peer: user.id,
            description: this.getDescription(type, user),
        }, type + key);
    };

    SectionRows = (type, users) => {
        if (users.length === 0) {
            return null;
        }

        const title = this.getTitle(type);

        return (
            <Group header={
                <Header
                    mode="secondary"
                    indicator={ this.helpers.formatNumber(users.length) }
                >{ title }</Header>
            }>
                {
                    users.slice(0, 3).map((user, key) => this.UserRow(user, type, key))
                }

                {
                    users.length > 3 &&
                    <CellButton
                        centered
                        before={ <Icon24Users3Outline /> }
                        onClick={ () => {
                            this.context.showModal('custom', {
                                header: title,
                                content: users.map((user, key) => this.UserRow(user, type, key)),
                            });
                        } }
                    >
                        { this.lang('methods.contacts_analysis.show_all_users') }
                    </CellButton>
                }
            </Group>
        );
    };

    content = () => {
        const { contacts } = this.state;

        if (contacts) {
            return (
                <>
                    { this.SectionRows('premiumUsers', contacts.premiumUsers) }
                    { this.SectionRows('oldUsers', contacts.oldUsers) }
                    { this.SectionRows('mutualUsers', contacts.mutualUsers) }
                    { this.SectionRows('nonMutualUsers', contacts.nonMutualUsers) }
                    { this.SectionRows('withoutPhotoUsers', contacts.withoutPhotoUsers) }
                    { this.SectionRows('verifiedUsers', contacts.verifiedUsers) }
                    { this.SectionRows('withoutPhoneUsers', contacts.withoutPhoneUsers) }
                    { this.SectionRows('withoutUsernameUsers', contacts.withoutUsernameUsers) }
                    { this.SectionRows('deletedUsers', contacts.deletedUsers) }
                    { this.SectionRows('longTimeOnlineUsers', contacts.longTimeOnlineUsers) }
                    { this.SectionRows('hideOnlineUsers', contacts.hideOnlineUsers) }
                    { this.SectionRows('recentOnlineUsers', contacts.recentOnlineUsers) }
                </>
            );
        }
    };

}

import React from 'react';

import * as VKIcons from '@vkontakte/icons';
import * as Methods from './functions';

import { lang } from './js/lang';

const iconProps = {
    width: 28,
    height: 28,
    fill: 'var(--accent)'
};

const blocks = [
    {
        id: 'account',
        icon: VKIcons.Icon28UserOutline,
        methods: [
            {
                id: 'clear_stickers',
                icon: VKIcons.Icon28StickerSmileOutline,
                component: Methods.AccountClearStickers,
            },
            {
                id: 'id',
                icon: VKIcons.Icon28CoinsOutline,
                component: Methods.AccountId,
            },
        ]
    },
    {
        id: 'contacts',
        icon: VKIcons.Icon28UsersOutline,
        methods: [
            {
                id: 'analysis',
                icon: VKIcons.Icon28Users3Outline,
                component: Methods.ContactsAnalysis,
            },
        ]
    },
    {
        id: 'dialogs',
        icon: VKIcons.Icon28MessagesOutline,
        methods: [
            {
                id: 'admins',
                icon: VKIcons.Icon28UserStarBadgeOutline,
                component: Methods.DialogsAdmins,
            },
            {
                id: 'messages_stat',
                icon: VKIcons.Icon28StatisticsOutline,
                component: Methods.DialogsMessagesStat,
            },
            {
                id: 'read',
                icon: VKIcons.Icon28MessageUnreadTop,
                component: Methods.DialogsRead,
            },
            {
                id: 'top_channels',
                icon: VKIcons.Icon28MessageReplyOutline,
                component: Methods.DialogsTopChannels,
            },
        ]
    },
];

export const getBlocks = () => {
    return blocks.map(({ id, icon }) => {
        return {
            id,
            title: lang(`sections.${ id }.block_name`),
            icon: React.createElement(icon, iconProps),
        };
    });
};

export const getAllMethods = () => {
    const allMethods = [];

    blocks.forEach(({ id, methods }) => {
        methods.forEach((method) => {
            allMethods.push({
                ...method,
                id: `${ id }_${ method.id }`,
                name: lang(`sections.${ id }.methods.${ method.id }`),
                icon: React.createElement(method.icon, iconProps),
            });
        });
    });

    allMethods.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
    });

    return allMethods;
};

export const getBlockMethods = (blockId) => {
    const block = blocks.find(({ id }) => id === blockId);
    const blockMethods = block.methods.map(({ id }) => `${ blockId }_${ id }`);

    return getAllMethods().filter(({ id }) => blockMethods.includes(id));
};

export const findMethod = (methodId) => {
    return getAllMethods().find(({ id }) => id === methodId);
};

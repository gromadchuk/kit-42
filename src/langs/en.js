module.exports = {
    sections: {
        title: 'Categories',
        account: {
            block_name: 'Page',
            methods: {
                clear_stickers: 'Stickers clearing',
                id: 'Get user\'s id'
            }
        },
        contacts: {
            block_name: 'Contacts',
            methods: { analysis: 'Contacts analysis' }
        },
        dialogs: {
            block_name: 'Messages',
            methods: {
                admins: 'Administrated chats and channels',
                messages_stat: 'Messages stats',
                read: 'Read chats',
                top_channels: 'Top of chats and channels'
            }
        }
    },
    auth: {
        description: 'Kit 42 is a product with many features for Telegram. For the product to work, you need to log in to your Telegram account.',
        input_number: 'Phone number',
        input_code: 'Authorization code',
        input_password: '2FA password',
        button_number: 'Send code',
        button_code: 'Confirm',
        button_password: 'Login',
        not_registered: 'Account with this number not found'
    },
    app: {
        cancel: 'Cancel',
        back: 'Back',
        loading: 'One second, please',
        loading_dialogs: 'Getting dialogs',
        finish: 'Done',
        error: 'Error',
        wait_error: 'Too many requests to API, please wait {time}',
        lang: 'Language',
        alpha: {
            title: 'Alpha version',
            description: 'It\'s an alpha version of product, there could be mistakes. If you found mistake, or you have suggestion, please DM developer. Features will be added during the product\'s life!',
            button_dev: 'Developer'
        },
        wait_error_seconds: [
            'second',
            'seconds',
            'seconds'
        ],
        time_decline: {
            days: [
                'day',
                'days',
                'days'
            ],
            hours: [
                'hour',
                'hours',
                'hours'
            ],
            minutes: [
                'minute',
                'minutes',
                'minutes'
            ],
            seconds: [
                'second',
                'seconds',
                'seconds'
            ]
        }
    },
    profile: {
        title: 'Profile',
        logout: 'Logout',
        theme: {
            title: 'Theme',
            light: 'Light',
            dark: 'Dark'
        }
    },
    MTProtoErrors: {
        PHONE_NUMBER_INVALID: 'Invalid phone number',
        PHONE_CODE_INVALID: 'Invalid code',
        PASSWORD_HASH_INVALID: 'Invalid password',
        CHANNEL_PRIVATE: 'You are not member of this chat',
        MSG_ID_INVALID: 'Invalid message ID',
        USER_ID_INVALID: 'Invalid user ID',
        CHANNEL_INVALID: 'Channel is invalid',
        FILE_REFERENCE_: 'The file reference expired, it must be refreshed',
        FILEREF_UPGRADE_NEEDED: 'The client has to be updated in order to support file references',
        FILE_ID_INVALID: 'File ID is invalid',
        FILE_REFERENCE_EXPIRED: 'File reference expired, it must be refetched as described in the documentation',
        LIMIT_INVALID: 'Limit is invalid',
        LOCATION_INVALID: 'Location is invalid',
        OFFSET_INVALID: 'Offset is invalid',
        PEER_ID_INVALID: 'Invalid peer ID',
        API_ID_INVALID: 'API ID invalid',
        API_ID_PUBLISHED_FLOOD: 'This API id was published somewhere, you can\'t use it now',
        AUTH_RESTART: 'Restart the authorization process',
        PHONE_NUMBER_APP_SIGNUP_FORBIDDEN: 'You can\'t sign up using this app',
        PHONE_NUMBER_BANNED: 'The provided phone number is banned from Telegram',
        PHONE_NUMBER_FLOOD: 'You asked for the code too many times',
        PHONE_PASSWORD_FLOOD: 'You have tried logging in too many times',
        PHONE_PASSWORD_PROTECTED: 'This phone is password protected',
        SMS_CODE_CREATE_FAILED: 'An error occurred while creating the SMS code',
        PHONE_CODE_EMPTY: 'Phone code is missing',
        PHONE_CODE_EXPIRED: 'Code has been expired',
        PHONE_NUMBER_UNOCCUPIED: 'The phone number is free',
        SIGN_IN_FAILED: 'Failure while signing in',
        SRP_ID_INVALID: 'Invalid SRP ID',
        SRP_PASSWORD_CHANGED: 'Password has been changed',
        CONNECTION_LAYER_INVALID: 'Layer invalid',
        USERNAME_INVALID: 'Username is invalid',
        USERNAME_NOT_OCCUPIED: 'Username is available',
        STICKERSET_INVALID: 'Sticker set is invalid.'
    },
    MultiProgress: { empty_total: 'Counting' },
    methods: {
        account_id: {
            button_get: 'Get ID',
            unknown_owner: 'Couldn\'t define owner'
        },
        account_clear_stickers: {
            stickers: 'Added sticker sets',
            clear_stickers: 'Delete stickers',
            not_found: 'Added stickers not found'
        },
        contacts_analysis: {
            show_all_users: 'Show all',
            not_found: 'Contacts not found',
            headers: {
                premium: 'Have Telegram Premium',
                old: 'Registered in first 100 millions users',
                mutual: 'In contacts of each other',
                non_mutual: 'Non-reciprocal contacts',
                without_photo: 'Without photo',
                verified: 'Verified',
                without_phone: 'Unknown phone number',
                without_username: 'Without username',
                deleted: 'Deleted',
                long_time_online: 'Long time offline',
                hide_online: 'Hide online',
                recent_online: 'By last online time'
            }
        },
        dialogs_admins: {
            no_admins: 'Administrated chats or channels not found',
            creator: 'Creator',
            admin: 'Administrator'
        },
        dialogs_messages_stat: {
            no_messages: 'No messages in dialogue',
            too_few_messages: 'For stats need more messages',
            get_messages: 'Getting messages',
            stat_date: 'Stats for {date}',
            tops: {
                count: 'Messages',
                uniq_count: 'Unique messages',
                emoji: 'Premium Emoji',
                attachments: 'Attachments',
                stickers: 'Stickers',
                voice_duration: 'Voice messages',
                round_duration: 'Video messages'
            },
            uniq_description: 'Several messages in a row, inseparable by other interlocutor, will be considered unique',
            total_descriptions: {
                voice: 'Voice messages duration',
                round: 'Video messages duration',
                calls: 'Calls duration'
            },
            not_counted: 'Couldn\'t define the period',
            periods_header: 'Period of stats',
            periods: {
                1: 'Day',
                3: '3 days',
                7: 'Week',
                14: '2 weeks',
                30: 'Month',
                90: 'Quarter',
                180: 'Six months',
                365: 'Year',
                all: 'All dialogue'
            },
            decline: {
                count: [
                    'message',
                    'messages',
                    'messages'
                ],
                uniq_count: [
                    'unique message',
                    'unique messages',
                    'unique messages'
                ],
                emoji: [
                    'premium emoji',
                    'premium emoji',
                    'premium emoji'
                ],
                attachments: [
                    'attachment',
                    'attachments',
                    'attachments'
                ],
                stickers: [
                    'sticker',
                    'stickers',
                    'stickers'
                ]
            }
        },
        dialogs_read: {
            no_dialogs: 'No unread dialogues',
            dialogs: 'Unread dialogues',
            read_dialogs: 'Read dialogues'
        },
        dialogs_top_channels: {
            tab_users: 'Users',
            tab_chats: 'Chats',
            tab_channels: 'Channels',
            no_dialogs: 'No dialogues',
            messages: [
                'message',
                'messages',
                'messages'
            ],
            members: [
                'member',
                'members',
                'members'
            ]
        }
    }
};
module.exports = {
    sections: {
        title: 'Категории',
        account: {
            block_name: 'Страница',
            methods: {
                clear_stickers: 'Очистка стикеров',
                id: 'Узнать ID страницы',
            }
        },
        contacts: {
            block_name: 'Контакты',
            methods: {
                analysis: 'Анализ контактов',
            }
        },
        dialogs: {
            block_name: 'Сообщения',
            methods: {
                admins: 'Администрируемые чаты и каналы',
                messages_stat: 'Статистика сообщений',
                read: 'Прочитать диалоги',
                top_channels: 'Топ чатов и каналов',
            }
        }
    },
    auth: {
        description: 'Kit 42 — продукт с множеством функций для Telegram. Для работы продукта нужно авторизоваться в свой аккаунт Telegram.',
        input_number: 'Номер телефона',
        input_code: 'Код для авторизации',
        input_password: '2FA пароль',
        button_number: 'Отправить код',
        button_code: 'Подтвердить',
        button_password: 'Войти',
        not_registered: 'Аккаунт с таким номером не найден',
    },
    app: {
        cancel: 'Отмена',
        back: 'Назад',
        loading: 'Секундочку',
        loading_dialogs: 'Получаю диалоги',
        finish: 'Готово',
        error: 'Ошибка',
        wait_error: 'Слишком много запросов к API, нужно подождать {time}',
        lang: 'Язык',
        alpha: {
            title: 'Альфа-версия',
            description: 'Это альфа-версия продукта, в ней могут быть ошибки и недоработки. Если вы нашли ошибку или у вас есть предложение, пожалуйста, напишите об этом разработчику в личные сообщения. Функции будут добавляться по ходу жизни продукта!',
            button_dev: 'Разработчик',
        },
        wait_error_seconds: [
            'секунду',
            'секунды',
            'секунд'
        ],
        time_decline: {
            days: [
                'сутки',
                'суток',
                'суток'
            ],
            hours: [
                'час',
                'часа',
                'часов'
            ],
            minutes: [
                'минута',
                'минуты',
                'минут'
            ],
            seconds: [
                'секунда',
                'секунды',
                'секунд'
            ]
        }
    },
    profile: {
        title: 'Профиль',
        logout: 'Выйти',
        theme: {
            title: 'Тема оформления',
            light: 'Светлая',
            dark: 'Темная',
        }
    },
    MTProtoErrors: {
        PHONE_NUMBER_INVALID: 'Неверный номер телефона',
        PHONE_CODE_INVALID: 'Некорректный код',
        PASSWORD_HASH_INVALID: 'Некорректный пароль',
        CHANNEL_PRIVATE: 'You haven\'t joined this channel/supergroup',
        MSG_ID_INVALID: 'Invalid message ID provided',
        USER_ID_INVALID: 'The provided user ID is invalid',
        CHANNEL_INVALID: 'The provided channel is invalid',
        FILE_REFERENCE_: 'The file reference expired, it must be refreshed',
        FILEREF_UPGRADE_NEEDED: 'The client has to be updated in order to support file references',
        FILE_ID_INVALID: 'The provided file id is invalid',
        FILE_REFERENCE_EXPIRED: 'File reference expired, it must be refetched as described in the documentation',
        LIMIT_INVALID: 'The provided limit is invalid',
        LOCATION_INVALID: 'The provided location is invalid',
        OFFSET_INVALID: 'The provided offset is invalid',
        PEER_ID_INVALID: 'The provided peer id is invalid',
        API_ID_INVALID: 'API ID invalid',
        API_ID_PUBLISHED_FLOOD: 'This API id was published somewhere, you can\'t use it now',
        AUTH_RESTART: 'Restart the authorization process',
        PHONE_NUMBER_APP_SIGNUP_FORBIDDEN: 'You can\'t sign up using this app',
        PHONE_NUMBER_BANNED: 'The provided phone number is banned from telegram',
        PHONE_NUMBER_FLOOD: 'You asked for the code too many times',
        PHONE_PASSWORD_FLOOD: 'You have tried logging in too many times',
        PHONE_PASSWORD_PROTECTED: 'This phone is password protected',
        SMS_CODE_CREATE_FAILED: 'An error occurred while creating the SMS code',
        PHONE_CODE_EMPTY: 'phone_code is missing',
        PHONE_CODE_EXPIRED: 'The phone code you provided has expired',
        PHONE_NUMBER_UNOCCUPIED: 'The phone number is not yet being used',
        SIGN_IN_FAILED: 'Failure while signing in',
        SRP_ID_INVALID: 'Invalid SRP ID provided',
        SRP_PASSWORD_CHANGED: 'Password has changed',
        CONNECTION_LAYER_INVALID: 'Layer invalid',
        USERNAME_INVALID: 'The provided username is not valid',
        USERNAME_NOT_OCCUPIED: 'The provided username is not occupied',
        STICKERSET_INVALID: 'The provided sticker set is invalid.',
    },
    MultiProgress: {
        empty_total: 'Считаем'
    },
    methods: {
        account_id: {
            button_get: 'Получить ID',
            unknown_owner: 'Не смогли определить овнера',
        },
        account_clear_stickers: {
            stickers: 'Добавлено стикерпаков',
            clear_stickers: 'Удалить стикеры',
            not_found: 'Не найдено добавленных стикеров',
        },
        contacts_analysis: {
            show_all_users: 'Показать всех',
            not_found: 'Не найдено контактов',
            headers: {
                premium: 'Есть подписка Telegram Premium',
                old: 'Зарегистрировались в первых 100 миллионах пользователей',
                mutual: 'В контактах друг у друга',
                non_mutual: 'Невзаимные контакты',
                without_photo: 'Без фото',
                verified: 'Верифицированные',
                without_phone: 'Неизвестен номер телефона',
                without_username: 'Без адреса страницы',
                deleted: 'Удаленные',
                long_time_online: 'Давно не были онлайн',
                hide_online: 'Скрыли свой онлайн',
                recent_online: 'По времени последнего онлайна',
            }
        },
        dialogs_admins: {
            no_admins: 'Не нашли администрируемых чатов или каналов',
            creator: 'Создатель',
            admin: 'Администратор',
        },
        dialogs_messages_stat: {
            no_messages: 'В диалоге нет сообщений',
            too_few_messages: 'Для статистики нужно больше сообщений',
            get_messages: 'Получение сообщений',
            stat_date: 'Статистика за {date}',
            tops: {
                count: 'Сообщения',
                uniq_count: 'Уникальные сообщения',
                emoji: 'Premium Emoji',
                attachments: 'Вложения',
                stickers: 'Стикеры',
                voice_duration: 'Голосовые сообщения',
                round_duration: 'Видеосообщения',
            },
            uniq_description: 'Несколько сообщений подряд, не разделенные другими собеседниками, будут считаться уникальными',
            total_descriptions: {
                voice: 'Длительность голосовых сообщений',
                round: 'Длительность видеосообщений',
                calls: 'Длительность звонков',
            },
            not_counted: 'Не смогли определить период',
            periods_header: 'Период статистики',
            periods: {
                1: 'Сутки',
                3: '3 суток',
                7: 'Неделя',
                14: '2 недели',
                30: 'Месяц',
                90: 'Квартал',
                180: 'Полгода',
                365: 'Год',
                all: 'Весь диалог',
            },
            decline: {
                count: [
                    'сообщение',
                    'сообщения',
                    'сообщений'
                ],
                uniq_count: [
                    'уникальное сообщение',
                    'уникальных сообщения',
                    'уникальных сообщений'
                ],
                emoji: [
                    'премиум эмодзи',
                    'премиум эмодзи',
                    'премиум эмодзи'
                ],
                attachments: [
                    'вложение',
                    'вложения',
                    'вложений'
                ],
                stickers: [
                    'стикер',
                    'стикера',
                    'стикеров'
                ],
            }
        },
        dialogs_read: {
            no_dialogs: 'Нет непрочитанных диалогов',
            dialogs: 'Непрочитанных диалогов',
            read_dialogs: 'Прочитать диалоги',
        },
        dialogs_top_channels: {
            tab_users: 'Пользователи',
            tab_chats: 'Чаты',
            tab_channels: 'Каналы',
            no_dialogs: 'Нет диалогов',
            messages: [
                'сообщение',
                'сообщения',
                'сообщений'
            ],
            members: [
                'участник',
                'участника',
                'участников'
            ],
        },
    }
}

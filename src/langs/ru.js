module.exports = {
    sections: {
        title: 'Категории',
        account: {
            block_name: 'Страница',
            methods: {
                clear_stickers: 'Очистка стикеров',
                id: 'Узнать ID страницы'
            }
        },
        contacts: {
            block_name: 'Контакты',
            methods: { analysis: 'Анализ контактов' }
        },
        dialogs: {
            block_name: 'Сообщения',
            methods: {
                admins: 'Администрируемые чаты и каналы',
                messages_stat: 'Статистика сообщений',
                read: 'Прочитать диалоги',
                top_channels: 'Топ чатов и каналов'
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
        not_registered: 'Аккаунт с таким номером не найден'
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
            button_dev: 'Разработчик'
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
            dark: 'Темная'
        }
    },
    MTProtoErrors: {
        PHONE_NUMBER_INVALID: 'Неверный номер телефона',
        PHONE_CODE_INVALID: 'Некорректный код',
        PASSWORD_HASH_INVALID: 'Неверный пароль',
        CHANNEL_PRIVATE: 'Вы не состоите в данном чате',
        MSG_ID_INVALID: 'Неверный ID сообщения',
        USER_ID_INVALID: 'Неверный ID пользователя',
        CHANNEL_INVALID: 'Указанный канал недействителен',
        FILE_REFERENCE_: 'Срок действия ссылки на файл истек, ее необходимо обновить',
        FILEREF_UPGRADE_NEEDED: 'Клиент должен быть обновлен, чтобы поддерживать ссылки на файлы',
        FILE_ID_INVALID: 'Указанный идентификатор файла недействителен',
        FILE_REFERENCE_EXPIRED: 'Срок действия ссылки на файл истек, ее необходимо повторно загрузить, как описано в документации',
        LIMIT_INVALID: 'Указанный лимит недействителен',
        LOCATION_INVALID: 'Указанное местоположение является недействительным',
        OFFSET_INVALID: 'Указанное смещение является недопустимым',
        PEER_ID_INVALID: 'Указанный идентификатор недействителен',
        API_ID_INVALID: 'Недопустимый идентификатор API',
        API_ID_PUBLISHED_FLOOD: 'Этот идентификатор API был где-то опубликован, вы не можете использовать его сейчас',
        AUTH_RESTART: 'Перезапустите процесс авторизации',
        PHONE_NUMBER_APP_SIGNUP_FORBIDDEN: 'Вы не можете зарегистрироваться, используя данное приложение',
        PHONE_NUMBER_BANNED: 'Указанный номер телефона заблокирован в telegram',
        PHONE_NUMBER_FLOOD: 'Вы запрашивали код слишком много раз',
        PHONE_PASSWORD_FLOOD: 'Вы пытались войти в систему слишком много раз',
        PHONE_PASSWORD_PROTECTED: 'Этот телефон защищен паролем',
        SMS_CODE_CREATE_FAILED: 'Произошла ошибка при создании SMS-кода',
        PHONE_CODE_EMPTY: 'телефонный код отсутствует',
        PHONE_CODE_EXPIRED: 'Срок действия предоставленного вами телефонного кода истек',
        PHONE_NUMBER_UNOCCUPIED: 'Номер телефона еще не используется',
        SIGN_IN_FAILED: 'Ошибка при входе',
        SRP_ID_INVALID: 'Предоставлен неверный идентификатор SRP',
        SRP_PASSWORD_CHANGED: 'Пароль был изменён',
        CONNECTION_LAYER_INVALID: 'Недопустимый слой',
        USERNAME_INVALID: 'Указанное имя пользователя недействительно',
        USERNAME_NOT_OCCUPIED: 'Указанное имя пользователя свободно',
        STICKERSET_INVALID: 'Предоставленный стикерпак недействителен.'
    },
    MultiProgress: { empty_total: 'Считаем' },
    methods: {
        account_id: {
            button_get: 'Получить ID',
            unknown_owner: 'Не смогли определить страницу'
        },
        account_clear_stickers: {
            stickers: 'Добавлено стикерпаков',
            clear_stickers: 'Удалить стикеры',
            not_found: 'Не найдено добавленных стикеров'
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
                recent_online: 'По времени последнего онлайна'
            }
        },
        dialogs_admins: {
            no_admins: 'Не нашли администрируемых чатов или каналов',
            creator: 'Создатель',
            admin: 'Администратор'
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
                round_duration: 'Видеосообщения'
            },
            uniq_description: 'Несколько сообщений подряд, не разделенные другими собеседниками, будут считаться уникальными',
            total_descriptions: {
                voice: 'Длительность голосовых сообщений',
                round: 'Длительность видеосообщений',
                calls: 'Длительность звонков'
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
                all: 'Весь диалог'
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
                ]
            }
        },
        dialogs_read: {
            no_dialogs: 'Нет непрочитанных диалогов',
            dialogs: 'Непрочитанных диалогов',
            read_dialogs: 'Прочитать диалоги'
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
            ]
        }
    }
};
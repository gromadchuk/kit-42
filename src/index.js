import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

import { AppRoot, AdaptivityProvider, ConfigProvider, WebviewType } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './css/app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ConfigProvider webviewType={ WebviewType.INTERNAL }>
        <AdaptivityProvider>
            <AppRoot>
                <App />
            </AppRoot>
        </AdaptivityProvider>
    </ConfigProvider>
);

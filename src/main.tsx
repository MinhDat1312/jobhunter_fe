import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/reset.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { ConfigProvider } from 'antd';
import './config/i18n.ts';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import i18n from './config/i18n.ts';

const antLocale = i18n.language === 'vi' ? viVN : enUS;

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ConfigProvider
            locale={antLocale}
            theme={{
                token: {
                    fontFamily: 'Inter, sans-serif',
                    colorPrimary: '#00b452',
                },
            }}
        >
            <Provider store={store}>
                <App />
            </Provider>
        </ConfigProvider>
    </StrictMode>,
);

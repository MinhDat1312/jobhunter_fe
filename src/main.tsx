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

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ConfigProvider
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

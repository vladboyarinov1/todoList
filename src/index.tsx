import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App/App';
import {Provider} from 'react-redux';
import {store} from './App/store';
import './common/styles/fonts.module.css'
import {BrowserRouter, HashRouter} from 'react-router-dom';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>
);

reportWebVitals();

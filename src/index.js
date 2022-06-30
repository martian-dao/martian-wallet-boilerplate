import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles/page.css';
import './styles/layout.css';
import './styles/typography.css';
import App from './App';
import { Buffer } from "buffer";
global.Buffer = Buffer;

// chrome.runtime.connect({ name: "popup" });

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
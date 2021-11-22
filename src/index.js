import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { QueryParamProvider } from 'use-query-params';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'


ReactDOM.render(
  <React.StrictMode>
    <QueryParamProvider>
    <App />
    </QueryParamProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


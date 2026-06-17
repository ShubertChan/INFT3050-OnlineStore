// 🌟 重点是加上这一行！这会导入 Bootstrap 的核心样式
import 'bootstrap/dist/css/bootstrap.min.css'; 

import React from 'react'; 
import ReactDOM from 'react-dom/client'; 

// 建议把你们组长原有的 index.css 也引入回来，保留全局背景色等设置
import './index.css'; 

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
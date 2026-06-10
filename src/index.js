import '../node_modules/react-bootstrap/dist/react-bootstrap.min';
//import '../node_modules/react-bootstrap/dist/react-bootstrap';
import React from 'react'; //create components
import ReactDOM from 'react-dom/client'; //display React in browser
//import './index.css'; //use react-bootstrap instead
import App from './App';
import reportWebVitals from './reportWebVitals';//Measuring app performance
 
//Connect React to HTML
//React will render everything inside "root"
//StrictMode: Development helper (checks for errors)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

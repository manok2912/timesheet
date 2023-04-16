import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Analytics } from '@vercel/analytics/react';
import axios from 'axios';
console.log(process.env);

axios.post("/test", {
    email: "email",
    password: "password"
  }, {
    baseURL: process.env.REACT_APP_MDB_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers':'*',
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials':true,
        'api-key': process.env.REACT_APP_MDB_API_TOKEN,
    },
  })
  .then((response) => {
    console.log(response);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
        <Analytics />
    </React.StrictMode>
);

// If you want to start testt measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
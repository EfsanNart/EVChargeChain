// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StationStatus = () => {
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('https://api.example.com/station/status');
            setStatus(result.data.status);
        };
        fetchData();
    }, []);

    return (
        <div>
            <p>Station Status: {status}</p>
        </div>
    );
};

export default StationStatus;


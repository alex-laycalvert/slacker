import React from 'react';
import {render} from 'ink';
import App from './components/App';
import SlackerAPI from './api';

const start = async () => {
    require('dotenv').config()
    
    SlackerAPI.initialize({
        apiToken: process.env['SLACK_API_TOKEN'],
        appToken: process.env['SLACK_APP_TOKEN'],
    });

    render(<App />);
}

start()

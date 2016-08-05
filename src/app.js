require('./sass/app.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import AppComponent from './components/Main';


ReactDOM.render(
    <AppComponent />,
    document.getElementById('app-root')
);
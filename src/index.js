import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import TimeLogging from './TimeLogging';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<TimeLogging />, document.getElementById('root'));
registerServiceWorker();

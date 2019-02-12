import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import App from './components/App';
import withUsers from './components/Session/withUsers';
import registerServiceWorker from './registerServiceWorker';

let AppWithData = withUsers(App);

ReactDOM.render(<AppWithData />, document.getElementById('root'));
registerServiceWorker();

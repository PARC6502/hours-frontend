import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';

import Dashboard from './Dashboard';
import TimeLoggingForm from './TimeLoggingForm';

const App = function(props) {
	return (
		<Dashboard>
			<TimeLoggingForm />
		</Dashboard>
	);
};

export default App;
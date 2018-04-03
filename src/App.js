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
import HomePage from './HomePage';

const App = function(props) {
	return (
		<Router>
		<div>
			<Dashboard />
			<Switch>
				<Route exact path='/' component={HomePage} />
				<Route exact path='/log-activity' component={TimeLoggingForm} />
				<Route render={({ location }) => (
		          <div className='ui inverted red segment'>
		            <h3>
		              Error! No matches for <code>{location.pathname}</code>
		            </h3>
		          </div>
		        )} />
			</Switch>
			</div>
		</Router>
	);
};

export default App;
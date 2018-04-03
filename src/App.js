import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';

import Dashboard from './Dashboard';
import TimeLoggingForm from './TimeLoggingForm';
import SendHrsForm from './SendHrsForm';
import HomePage from './HomePage';

const App = function(props) {
	return (
		<Router>
			<Fragment>
				<Dashboard />
				<Switch>
					<Route exact path='/' component={HomePage} />
					<Route exact path='/add-hrs' component={TimeLoggingForm} />
					<Route exact path='/send-hrs' component={SendHrsForm} />
					<Route render={({ location }) => (
			          <div className='ui inverted red segment'>
			            <h3>
			              Error! No matches for <code>{location.pathname}</code>
			            </h3>
			          </div>
			        )} />
				</Switch>
			</Fragment>
		</Router>
	);
};

export default App;
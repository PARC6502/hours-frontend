import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Dashboard from './Dashboard';
import TimeLoggingForm from './TimeLoggingForm';
import SendHrsForm from './SendHrsForm';
import HomePage from './HomePage';
import UserPage from './UserPage';

const App = function(props) {
	return (
		<Router>
			<Fragment>
				<Dashboard />
				<Switch>
					<Route exact path='/' component={HomePage} />
					<Route exact path='/add-hrs' component={TimeLoggingForm} />
					<Route exact path='/send-hrs' component={SendHrsForm} />
					<Route path='/user/:userId' component={UserPage} />
					<Route render={({ location }) => {
						// console.log(location);
						return (
				          <h1>404! {location.pathname} not found!</h1>
				        );
			        }} />
				</Switch>
			</Fragment>
		</Router>
	);
};

export default App;
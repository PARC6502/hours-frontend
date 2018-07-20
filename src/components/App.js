import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

// import Dashboard from './Dashboard';
import Navigation from './Navigation'
import TimeLoggingForm from './TimeLoggingForm';
import SendHrsForm from './SendHrsForm';
import HomePage from './HomePage';
import UserPage from './UserPage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import ManageAccount from './ManageAccount';
import ProfilePage from './ProfilePage';
import OrganisationPage from './OrganisationPage'
import withAuthAndUser from './Session/withAuthAndUser';

import * as routes from '../constants/routes';

const App = (props) => {
	return (
		<Router>
			<Fragment>
				<Navigation />
				<Switch>
					<Route exact path={routes.HOME_PAGE} component={HomePage} />
					<Route exact path={routes.SIGN_IN} component={SignInPage} />
					<Route exact path={routes.SIGN_UP} component={SignUpPage} />
					<Route exact path={routes.ADD_HRS} component={TimeLoggingForm} />
					<Route exact path={routes.SEND_HRS} component={SendHrsForm} />
					<Route exact path={routes.MANAGE_ACCOUNT} component={ManageAccount} />
					<Route exact path={routes.PROFILE} component={ProfilePage} />
					<Route path={routes.USER_PAGE} component={UserPage} />
					<Route path={routes.ORGANISATION_PAGE} component={OrganisationPage} />
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

export default withAuthAndUser(App);
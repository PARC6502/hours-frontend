import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Navigation from './Navigation';
import OfflineDimmer from './OfflineDimmer';
import InfoModal from './InfoModal';

import TimeLoggingForm from './TimeLoggingForm';
import SendHrsForm from './SendHrsForm';
import AboutPage from './AboutPage';
import HomePage from './HomePage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import ManageAccount from './ManageAccount';
import ProfilePage from './ProfilePage';
import ProfileEditPage from './ProfileEditPage';

import OrganisationPage from './InfoPages/OrganisationPage';
import UserPage from './InfoPages/UserPage';

import AddOrganisation from './Admin/AddOrganisation';
import EditOrganisation from './Admin/EditOrganisation';
import ManageRequests from './Admin/ManageRequests';
import AdminPage from './Admin/AdminPage';

import * as routes from '../constants/routes';

import FirebaseAuthUserProvider from './Session/FirebaseAuthUserProvider'

const App = (props) => {
	return (
		<FirebaseAuthUserProvider>
		<Router>
			<Fragment>
				<Navigation />
				<OfflineDimmer />
				<InfoModal />
				<Container style={{ marginTop: '4.5rem' }}>
					<Switch>
						<Route exact path={routes.HOME_PAGE} component={HomePage} />
						<Route exact path={routes.SIGN_IN} component={SignInPage} />
						<Route exact path={routes.SIGN_UP} component={SignUpPage} />
						<Route exact path={routes.ADD_HRS} component={TimeLoggingForm} />
						<Route exact path={routes.SEND_HRS} component={SendHrsForm} />
						<Route exact path={routes.MANAGE_ACCOUNT} component={ManageAccount} />
						<Route exact path={routes.PROFILE} component={ ProfilePage } />
						<Route exact path={routes.ABOUT_PAGE} component={AboutPage} />
						<Route exact path={routes.PROFILE_EDIT} component={ProfileEditPage} />
						<Route exact path={routes.USER_PAGE} component={UserPage} />
						<Route exact path={routes.ORGANISATION_PAGE} component={OrganisationPage} />
						<Route exact path={routes.ADMIN_PAGE} component={AdminPage} />
						<Route exact path={routes.ADMIN_ADD_ORGANISATION} component={AddOrganisation} />
						<Route exact path={routes.ADMIN_EDIT_ORGANISATION} component={EditOrganisation} />
						<Route exact path={routes.ADMIN_MANAGE_REQUESTS} component={ManageRequests} />
						<Route render={({ location }) => {
							// console.log(location);
							return (
							<h1>404! {location.pathname} not found!</h1>
							);
						}} />
					</Switch>
				</Container>
			</Fragment>
		</Router>
		</FirebaseAuthUserProvider>
	);
};

export default App;

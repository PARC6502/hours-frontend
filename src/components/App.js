import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Loadable from 'react-loadable';

// Universal components
import Navigation from './Navigation';
import OfflineDimmer from './OfflineDimmer';
import InfoModal from './InfoModal';
import HomePage from './HomePage';

// Components for other pages
// import TimeLoggingForm from './TimeLoggingForm';
// import SendHrsForm from './SendHrsForm';
// import SignInPage from './SignInPage';
// import SignUpPage from './SignUpPage';
// import ManageAccount from './ManageAccount';
import ProfilePage from './ProfilePage';
// import OrganisationPage from './InfoPages/OrganisationPage';
// import UserPage from './InfoPages/UserPage';

// Components for admin page
// import AddOrganisation from './Admin/AddOrganisation';
// import ManageRequests from './Admin/ManageRequests';
// import AdminPage from './Admin/AdminPage';

// Other
import * as routes from '../constants/routes';
import FirebaseAuthUserProvider from './Session/FirebaseAuthUserProvider'


// Loadable components
function Loading({ error }) {
	if (error) {
		return 'Oh nooess!';
	} else {
		return <h3>Loading...</h3>;
	}
}
const TimeLoggingForm = Loadable({
	loader: () => import('./TimeLoggingForm'),
	loading: Loading
});
const SendHrsForm = Loadable({
	loader: () => import('./SendHrsForm'),
	loading: Loading
});
const SignInPage = Loadable({
	loader: () => import('./SignInPage'),
	loading: Loading
});
const SignUpPage = Loadable({
	loader: () => import('./SignUpPage'),
	loading: Loading
});
const ManageAccount = Loadable({
	loader: () => import('./ManageAccount'),
	loading: Loading
});
// const ProfilePage = Loadable({
// 	loader: () => import('./ProfilePage'),
// 	loading: Loading
// });
const EditProfile = Loadable({
	loader: () => import('./EditProfile'),
	loading: Loading
})
const OrganisationPage = Loadable({
	loader: () => import('./InfoPages/OrganisationPage'),
	loading: Loading
});
const UserPage = Loadable({
	loader: () => import('./InfoPages/UserPage'),
	loading: Loading
});
const AddOrganisation = Loadable({
	loader: () => import('./Admin/AddOrganisation'),
	loading: Loading
});
const ManageRequests = Loadable({
	loader: () => import('./Admin/ManageRequests'),
	loading: Loading
});
const AdminPage = Loadable({
	loader: () => import('./Admin/AdminPage'),
	loading: Loading
});

const App = (props) => {
	return (
		<FirebaseAuthUserProvider>
		<Router>
			<Fragment>
				<Navigation />
				<OfflineDimmer />
				{/* <InfoModal /> */}
				<Container style={{ marginTop: '4.5rem' }}>
					<Switch>
						<Route exact path={routes.HOME_PAGE} component={HomePage} />
						<Route exact path={routes.SIGN_IN} component={SignInPage} />
						<Route exact path={routes.SIGN_UP} component={SignUpPage} />
						<Route exact path={routes.ADD_HRS} component={TimeLoggingForm} />
						<Route exact path={routes.SEND_HRS} component={SendHrsForm} />
						<Route exact path={routes.MANAGE_ACCOUNT} component={ManageAccount} />
						<Route exact path={routes.PROFILE} component={ProfilePage} />
						<Route exact path={routes.EDIT_PROFILE} component={EditProfile} />
						<Route exact path={routes.USER_PAGE} component={UserPage} />
						<Route exact path={routes.ORGANISATION_PAGE} component={OrganisationPage} />
						<Route exact path={routes.ADMIN_PAGE} component={AdminPage} />
						<Route exact path={routes.ADMIN_ADD_ORGANISATION} component={AddOrganisation} />
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

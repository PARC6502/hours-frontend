import React from 'react';

import ProfileDisplay from '../ProfileDisplay';

import { FirebaseAuthUserContext } from '../Session/FirebaseAuthUserProvider';
import withAuthorization from '../Session/withAuthorization';

const ProfilePage = () => 
	<FirebaseAuthUserContext.Consumer>
		{user => <ProfileDisplay user={{...user}} />}
	</FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user.role !== null;
export default withAuthorization(authCondition)(ProfilePage);
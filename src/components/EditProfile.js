import React, { Fragment } from 'react';
import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';
import withAuthorization from './Session/withAuthorization';
import EditBio from './EditBio';
import EditImage from './EditImage';


const EditProfile = (props) => 
    <Fragment>
        <EditImage imageUrl={props.user.image}  userId={props.user.id} />
        <EditBio bio={props.user.bio} userId={props.user.id} />
    </Fragment>

const EditProfilePage = () => 
	<FirebaseAuthUserContext.Consumer>
		{user => <EditProfile user={user} />}
	</FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(EditProfilePage);
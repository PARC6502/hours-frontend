import React, { Fragment } from 'react';
import databaseController from './databaseController';

const UserPage = ({match}) => {
	console.log(match.params.userId);
	const user = databaseController.getUser(match.params.userId);
	// return (<h1>Placeholder</h1>);
	if (user) {
		return (
			<Fragment>
				<h1>{user.name}</h1>
				<h2>Hours: {user.hours}</h2>
			</Fragment>
		)	
	}
	else {
		return (<h1>User not found</h1>)
	}
	
};

export default UserPage;
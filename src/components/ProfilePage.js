import React, { Fragment } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import AuthUserContext from './Session/AuthUserContext';
import withAuthorization from './Session/withAuthorization';
import { db } from '../firebase';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: null
		}
		db.getUser(this.props.user.id)
		.then( (user) => this.setState({ user, loading: false }))
	}
	
	render() {
		let user;
		if (this.state.user) {
			user = {...this.state.user};
		}
		else {
			user = { name: 'name', email: 'email', hours: 'NA'}
		}
		return (
			<Segment>
			<Dimmer active={this.state.loading}>
				<Loader content="loading" />
			</Dimmer>
			<h1> Profile Page</h1>
			<h2>Name: {user.name}</h2>
			<h2>Email: {user.email}</h2>
			<h2>Hours: {user.hours}</h2> 
		</Segment>
		)
	}	
};

const ProfilePage = () => 
	<AuthUserContext.Consumer>
		{user => <Profile user={user} />}
	</AuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(ProfilePage);
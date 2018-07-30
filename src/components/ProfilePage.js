import React from 'react';

import LoadingCardView from './LoadingCardView';
import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';
import withAuthorization from './Session/withAuthorization';
import { db } from '../firebase';

import nan from '../nan.jpg'

class Profile extends React.Component {
	state = {
		loading: true,
		user: null
	}

	componentDidMount() {
		if (this.props.user.id)
			db.getUser(this.props.user.id)
			.then( (user) => this.setState({ user, loading: false }));
	}

	componentDidUpdate(prevState,prevProps) {
		
		if (this.props.user.id && (prevProps.user === null || prevProps.user.id !== this.props.user.id))
			db.getUser(this.props.user.id)
			.then( (user) => this.setState({ user, loading: false }));
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
			<LoadingCardView
				loading={this.state.loading}
				header={user.name}
				meta={user.hours + ' hours'}
				image={nan}	 
			/>
		)
	}	
};

const ProfilePage = () => 
	<FirebaseAuthUserContext.Consumer>
		{user => <Profile user={user} />}
	</FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(ProfilePage);
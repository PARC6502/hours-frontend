import React from 'react';

import ProfileDisplay from '../ProfileDisplay';
import { db } from '../../firebase'

class UserPage extends React.Component {
	state = {
		user: null,
		loading: true,
	};
	
	componentDidMount() {
		this.updateUser();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.userId !== this.props.match.params.userId) {
			this.updateUser();
		}
	}

	updateUser = () => {
		db.getUser(this.props.match.params.userId)
		.then((user) => {
			this.setState({ user, loading: false });
			// console.log(this.state);
		})
	}
	
	
	render() {
		const { userId } = this.props.match.params;
		const user = {id: userId, ...this.state.user};
		return this.state.user ? <ProfileDisplay user={user} /> : null;
	}	
};

export default UserPage;
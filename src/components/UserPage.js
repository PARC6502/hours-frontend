import React, { Fragment } from 'react';
import databaseController from '../databaseController';

class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			hours: null,
		};
		const match = this.props.match;
		databaseController.getUser(match.params.userId)
		.then(({name, hours}) => {
			this.setState({ name, hours });
			console.log(this.state);
		})
	}
	
	

	
	
	render() {
		if (this.state.name) {
			return (
				<Fragment>
					<h1>{this.state.name}</h1>
					<h2>Hours: {this.state.hours}</h2>
				</Fragment>
			)	
		}
		else {
			return (<h1>User not found</h1>)
		}
	}	
};

export default UserPage;
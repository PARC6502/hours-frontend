import React, { Fragment } from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import { db } from '../firebase'

class UserPage extends React.Component {
	state = {
		name: '',
		hours: null,
		loading: true,
	};
	
	componentDidMount() {
		const match = this.props.match;
		console.log(match);
		db.getUser(match.params.userId)
		.then(({name, hours}) => {
			this.setState({ name, hours, loading: false });
			console.log(this.state);
		})
	}

	
	
	render() {
		return (
			<Segment>
				<Dimmer active={this.state.loading}>
					<Loader content="loading" />
				</Dimmer>
				<h1>Name: {this.state.name || ''}</h1>
				<h2>Hours: {this.state.hours !== null ? this.state.hours : ''}</h2> 
			</Segment>
		);
		// if (this.state.name) {
		// 	return (
		// 		<Fragment>
		// 			<h1>{this.state.name}</h1>
		// 			<h2>Hours: {this.state.hours}</h2>
		// 		</Fragment>
		// 	)	
		// }
		// else {
		// 	return (<h1>User not found</h1>)
		// }
	}	
};

export default UserPage;
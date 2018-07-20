import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';

import LoadingCardView from './LoadingCardView';
import { db } from '../firebase'
import userImage from '../daniel.jpg'

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
			<LoadingCardView 
				loading={this.state.loading} 
				image={userImage} 
				header={this.state.name || ''}
				meta={this.state.hours !== null ? `${this.state.hours} hours` : ''}
				extra={<Fragment><Icon name='user' /> User</Fragment>}
			/>
		)
	}	
};

export default UserPage;
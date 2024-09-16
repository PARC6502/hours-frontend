import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';

import LoadingCardView from './LoadingCardView';
import { db } from '../firebase'
import { getImageSize } from '../helpers';

class UserPage extends React.Component {
	state = {
		name: '',
		hours: null,
		meals: null,
		photo: null,
		loading: true,
	};

	componentDidMount() {
		const match = this.props.match;
		db.getUser(match.params.userId)
		.then(({name, hours, meals, photo}) => {
			this.setState({ name, hours, meals, photo, loading: false });
		})
	}



	render() {
		return (
			<LoadingCardView
				loading={this.state.loading}
				image={ getImageSize( this.state.photo, 'square_md' ) }
				header={this.state.name || ''}
				meta={this.state.hours !== null ? `${this.state.hours} people helped` : ''}
				extra={<Fragment><Icon name='user' /> User</Fragment>}
			/>
		)
	}
};

export default UserPage;

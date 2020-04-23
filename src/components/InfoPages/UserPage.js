import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';

import LoadingCardView from '../LoadingCardView';
import PersonalFeed from '../PersonalFeed';
import { db } from '../../firebase'

import { getImageSize } from '../../helpers';

class UserPage extends React.Component {
	state = {
		name: '',
		hours: null,
		meals: null,
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
		const { userId } = this.props.match.params;
		const meta = [];
		if ( this.state.hours ) {
			meta.push( `${ this.state.hours } people helped` );
		}
		if ( this.state.meals ) {
			meta.push( `${ this.state.meals } meals provided` );
		}
		return (
			<Fragment>
				<LoadingCardView
					loading={this.state.loading}
					image={ getImageSize( this.state.photo, 'square_md' ) }
					header={this.state.name || ''}
					meta={meta.join(', ')}
					extra={<Fragment><Icon name='user' /> User</Fragment>}
				/>
				<PersonalFeed userId={userId} />
			</Fragment>
		)
	}
};

export default UserPage;

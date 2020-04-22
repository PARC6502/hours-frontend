import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import LoadingCardView from './LoadingCardView';
import PersonalFeed from './PersonalFeed';
import { FirebaseAuthUserContext } from './Session/FirebaseAuthUserProvider';
import withAuthorization from './Session/withAuthorization';
import { db } from '../firebase';
import { PROFILE_EDIT } from '../constants/routes';
import { getImageSize } from '../helpers';

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

	render() {
		let user;
		if (this.state.user) {
			user = {...this.state.user};
		}
		else {
			user = { name: 'name', email: 'email', hours: 'NA', meals: 0, photo: null }
		}
		const meta = [ `${ user.hours } people helped` ];
		if ( user.meals ) {
			meta.push( `${ user.meals } meals provided` );
		}
		return (
			<Fragment>
				<LoadingCardView
					loading={this.state.loading}
					header={user.name}
					meta={ meta.join(', ') }
					image={ getImageSize(user.photo, 'square_md') }
					description={
						<Link to={PROFILE_EDIT}>Edit Profile</Link>
					}
				/>
				<PersonalFeed userId={this.props.user.id} />
			</Fragment>
		)
	}
};

const ProfilePage = () =>
	<FirebaseAuthUserContext.Consumer>
		{user => <Profile user={user} />}
	</FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(ProfilePage);

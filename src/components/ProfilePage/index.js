import React from 'react';
import { Grid } from 'semantic-ui-react';

import ProfileHeader from './ProfileHeader';
import Bio from './Bio';
// import LoadingCardView from '../LoadingCardView';
import PersonalFeed from '../PersonalFeed';
import { FirebaseAuthUserContext } from '../Session/FirebaseAuthUserProvider';
import withAuthorization from '../Session/withAuthorization';
// import { db } from '../../firebase';

import nan from '../../nan.jpg'

class GridProfileDisplay extends React.Component {
	render() {
		return (
			<Grid stackable>
				<Grid.Column width={6}>
					<ProfileHeader user={this.props.user} />
					{this.props.user.bio ? <Bio bioText={this.props.user.bio} /> : null}
				</Grid.Column>
				<Grid.Column width={10}>
					<PersonalFeed userId={this.props.user.id} />
				</Grid.Column>
			</Grid>)
	}
}

const ProfilePage = () => 
	<FirebaseAuthUserContext.Consumer>
		{user => <GridProfileDisplay user={{...user, image: nan}} />}
	</FirebaseAuthUserContext.Consumer>

const authCondition = (user) => user !== null;
export default withAuthorization(authCondition)(ProfilePage);


// class Profile extends React.Component {
// 	state = {
// 		loading: true,
// 		user: null
// 	}

// 	componentDidMount() {
// 		if (this.props.user.id)
// 			db.getUser(this.props.user.id)
// 			.then( (user) => this.setState({ user, loading: false }));
// 	}
	
// 	render() {
// 		let user;
// 		if (this.state.user) {
// 			user = {...this.state.user};
// 		}
// 		else {
// 			user = { name: 'name', email: 'email', hours: 'NA'}
// 		}
// 		return (
// 			<Fragment>
// 				<LoadingCardView
// 					loading={this.state.loading}
// 					header={user.name}
// 					meta={user.hours + ' hours'}
// 					image={nan}	 
// 				/>
// 				<PersonalFeed userId={this.props.user.id} />
// 			</Fragment>
// 		)
// 	}	
// };
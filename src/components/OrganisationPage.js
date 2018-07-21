import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';

import { db } from '../firebase';
import LoadingCardView from './LoadingCardView'; 

import moonScaffold from '../moonScaffold.jpg'

class OrganisationPage extends React.Component {
	state = {
		name: '',
		hoursGenerated: null,
		loading: true,
	};
	
	componentDidMount() {
		const match = this.props.match;
		console.log(match);
		db.getOrganisation(match.params.organisationId)
		.then(({name, hoursGenerated}) => {
			this.setState({ name, hoursGenerated, loading: false });
			console.log(this.state);
		})
	}

	
	
	render() {
		return (
			<LoadingCardView
				loading={this.state.loading} 
				header={this.state.name || ''}
				meta={this.state.hoursGenerated !== null 
				? this.state.hoursGenerated+' hours distributed' 
				: ''}
				image={moonScaffold}
				extra={<Fragment><Icon name='group' /> Organisation</Fragment>}
			/>
		);
	}	
};

export default OrganisationPage;
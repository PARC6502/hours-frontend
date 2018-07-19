import React, { Fragment } from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import { db } from '../firebase'

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
			<Segment>
				<Dimmer active={this.state.loading}>
					<Loader content="loading" />
				</Dimmer>
				<h1>Organisation: {this.state.name || ''}</h1>
				<h2>Hours Generated: {this.state.hoursGenerated !== null 
				? this.state.hoursGenerated : ''}</h2> 
			</Segment>
		);
	}	
};

export default OrganisationPage;
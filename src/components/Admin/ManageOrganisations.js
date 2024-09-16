import React, { Component } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import withAuthorization from '../Session/withAuthorization';
import { Dimmer, Loader, Segment, Icon, Divider } from 'semantic-ui-react';

class ManageOrganisations extends Component {
	state = {
		loading: true,
		organisations: []
	}

	componentDidMount() {
		db.getOrganisations()
			.then( organisations => this.setState( {
				organisations,
				loading: false,
			}))
	}

	render() {
		if ( this.state.loading ) {
			return <Dimmer inverted active><Loader inverted /></Dimmer>
		}

		if ( !this.state.loading && this.state.organisations.length === 0 ) {
			return <p>No organisations found</p>
		}

		return (
			<div className="organisation-list">
				<Divider hidden />
				{ this.state.organisations.map( org => (
					<Segment vertical key={ org.id }>
						<Icon.Group>
							<Icon name="group" />
							<Icon corner name="edit" />
						</Icon.Group>
						{ " " }
						<Link to={`/admin/edit-organisation/${org.id}`}>{org.name}</Link>
					</Segment>
				)) }
			</div>
		)
	}
}

const authCondition = (user) => (user.role === 'ADMIN');
export default withAuthorization(authCondition)(ManageOrganisations);

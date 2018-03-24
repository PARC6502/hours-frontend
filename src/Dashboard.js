import React, { Component, Fragment } from 'react';
import { Header, Image } from 'semantic-ui-react';
import userImage from './user_image.jpg';
import './Dashboard.css';

class Dashboard extends Component {
	user = {
		name: "Edgar Cahn",
		img: userImage,
		hours: [{
			project: "Inventing Time Banking",
			hours: 236
			},
			{project: "Teaching Law",
			hours: 123,
			}]
	};

	render() {
		return (
			<Fragment>
				<Header as="h1" className="Header">
					<Image circular src={this.user.img} />
					{' '}{this.user.name}
				</Header>
				{this.props.children}
			</Fragment>
		);
	}
}

export default Dashboard;
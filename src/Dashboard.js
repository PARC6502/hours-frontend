import React, { Component, Fragment } from 'react';
import { Header, Image, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
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
			<Menu className="Menu">
				<Menu.Item header className='Header'>
					<Image circular src={this.user.img} className="Image" />
					{' '}{this.user.name}
				</Menu.Item>
				<Menu.Item as={NavLink} to='/log-activity'>Log Activity</Menu.Item>
				<Menu.Item>Send Hrs</Menu.Item>
			</Menu>
		);
	}
}

export default Dashboard;
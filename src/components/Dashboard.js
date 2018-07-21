import React, { Component } from 'react';
import { Image, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import userImage from './user_image.jpg';
import './Dashboard.css';

class Dashboard extends Component {
	state = {
		user: {
			id: "edgar.cahn",
			hours: 100,
			name: "Edgar Cahn"
		}
	};
	
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
				<Menu.Item as={NavLink} to='/add-hrs'>Add Hrs</Menu.Item>
				<Menu.Item as={NavLink} to='/send-hrs'>Send Hrs</Menu.Item>
				<Menu.Item header className='Header' position='right'>
					{' '}{this.user.name}
					<Image circular src={this.user.img} className="Image" />
				</Menu.Item>
			</Menu>
		);
	}
}

export default Dashboard;
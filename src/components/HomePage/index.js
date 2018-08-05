import React, { Fragment } from 'react';
import { Segment } from 'semantic-ui-react';

import EventFeed from './EventFeed';

const HomePage = () =>
	<Fragment>
		<Segment>Welcome to the hours project dude</Segment>
		<EventFeed />
	</Fragment>

export default HomePage;
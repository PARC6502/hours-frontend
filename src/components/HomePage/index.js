import React, { Fragment } from 'react';
import { Segment } from 'semantic-ui-react';

import EventFeed from './EventFeed';

const HomePage = () =>
	<Fragment>
		<Segment style={{ marginTop: '10px' }}>Welcome to the hours project</Segment>
		<EventFeed />
	</Fragment>

export default HomePage;
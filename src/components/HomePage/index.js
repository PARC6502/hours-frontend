import React, { Fragment } from 'react';
import { Segment, Message } from 'semantic-ui-react';

import EventFeed from './EventFeed';

const DevWarningMessage = () => 
	<Message warning>This is a development build for testing, hours logged here are going into a different database.</Message>

const HomePage = () =>
	<Fragment>
		{process.env.REACT_APP_DEVELOP === 'false' ? null : <DevWarningMessage />}
		<Segment>Welcome to the hours project dude</Segment>
		<EventFeed />
	</Fragment>

export default HomePage;
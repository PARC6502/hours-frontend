import React, { Fragment } from 'react';
import { Segment } from 'semantic-ui-react';

import TransactionFeed from './TransactionFeed';

const HomePage = () =>
	<Fragment>
		<Segment>Welcome to the hours project</Segment>
		<TransactionFeed />
	</Fragment>

export default HomePage;
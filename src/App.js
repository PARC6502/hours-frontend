import React from 'react';
import Dashboard from './Dashboard';
import TimeLoggingForm from './TimeLoggingForm';

const App = function(props) {
	return (
		<Dashboard>
			<TimeLoggingForm />
		</Dashboard>
	);
};

export default App;
import React from 'react';

import AuthUserContext from './AuthUserContext';
import { firebase } from '../../firebase';

// higher order component
const withAuthentication = (Component) =>
    class WithAuthentication extends React.Component {
        state = {
            id: null,
            email: null
        }

        componentDidMount() {
            firebase.auth.onAuthStateChanged(user => {
                user
                    ? this.setState(() => ({ id: user.uid, email: user.email}))
                    : this.setState(() => ({ id: null, email: null }))
            })
        }

        render() {
            const user = { ...this.state };

            return (
                <AuthUserContext.Provider value={user}>
                    <Component />
                </AuthUserContext.Provider>
            );
        }
    }

export default withAuthentication;

import React from 'react';

import AuthUserContext from './AuthUserContext';
import { firebase } from '../../firebase';

// higher order component
const withAuthentication = (Component) => 
    class WithAuthentication extends React.Component {
        state = {
            id: null,
        }

        componentDidMount() {
            firebase.auth.onAuthStateChanged(authUser => {
                authUser
                    ? this.setState(() => ({ id: authUser.uid}))
                    : this.setState(() => ({ id: null }))
                console.log(this.state); 
            })
        }

        render() {
            const { id } = this.state;

            return (
                <AuthUserContext.Provider value={id}>
                    <Component />
                </AuthUserContext.Provider>
            );
        }
    }

export default withAuthentication;
import React from 'react';

import AuthUserContext from './AuthUserContext';
import { firebase, db } from '../../firebase';

// higher order component
const withAuthAndUser = (Component) => 
    class WithAuthAndUser extends React.Component {
        state = {
            id: null,
            email: null,
            name: 'Guest',
        }

        componentDidMount() {
            firebase.auth.onAuthStateChanged(user => {
                if(user) {
                    this.setState(() => ({ id: user.uid, email: user.email}))
                    db.getUser(user.uid)
                    .then(user => {
                        let role = user.role || 'USER' 
                        this.setState({ name: user.name, hours: user.hours, role: user.role  })
                    })
                }
                else {
                    this.setState(() => ({ id: null, email: null, name: 'Guest', hours: '' }))
                }
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

export default withAuthAndUser
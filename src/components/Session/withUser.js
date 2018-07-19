import React from 'react';

import { db, auth } from '../../firebase';
import UserContext from './UserContext';
import AuthUserContext from './AuthUserContext'

class WithUser extends React.Component {
    state = {
        name: '',
        email: '',
        hours: '',
    }
    
    componentDidMount() {
        db.getUser(this.props.user.id)
        .then( ({name, email, hours}) => this.setState({
            name,
            email,
            hours
        }))
    }

    render() {
        const user = {...this.state}
        return (
            <UserContext.Provider value={user}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

const withUser = (Component) =>
    <AuthUserContext.Consumer>
        {user => 
            <WithUser user={user}>
                <Component />
            </WithUser>
        }
    </AuthUserContext.Consumer>

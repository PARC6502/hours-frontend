import React from 'react';

import { db, auth } from '../../firebase';
import UserContext from './UserContext';
// import AuthUserContext from './AuthUserContext'

const withUser = (Component) =>
    class WithUser extends React.Component {
        state = {
            name: '',
            email: '',
            hours: '',
        }
        
        componentDidMount() {
            const userId = auth.getCurrentUserId();
            db.getUser(userId)
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
                    <Component />
                </UserContext.Provider>
            )
        }
    }

// const withUser = (Component) =>
//     <AuthUserContext.Consumer>
//         {user => user.id ?
//             <WithUser user={user}>
//                 <Component />
//             </WithUser>
//             : <Component />
//         }
//     </AuthUserContext.Consumer>


export default withUser
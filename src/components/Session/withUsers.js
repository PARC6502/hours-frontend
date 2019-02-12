import React from 'react';

import { db } from '../../firebase';

let UsersContext = React.createContext([]);


let withUsers = Component => {
    class WithUsers extends React.Component {
        state = {
            data: [],
            loading: true,
        }
        componentDidMount() {
            db.usersRef
            .onSnapshot(querySnapshot =>{
                this.setState({ loading: true });
                let users = [];
                querySnapshot.forEach( doc => users.push( {id: doc.id, ...doc.data()} ) )
                // console.log(users);
                // maybe can optimize this so only changes are merged with state?
                this.setState({ data: users, loading: false });
            })
        }

        render() {
            return (
                <UsersContext.Provider value={this.state}>
                    <Component {...this.props} />
                </UsersContext.Provider>
            );
        }
    }

    return WithUsers
}

export { UsersContext };
export default withUsers;
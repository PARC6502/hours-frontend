import React from 'react';

import { firebase, db } from '../../firebase';

const defaultUserContext = {
    pendingAuth: true,
    pendingUser: true,
    isUserSignedIn: false,
}

export const FirebaseAuthUserContext = React.createContext(defaultUserContext);

export default class FirebaseAuthUserProvider extends React.Component {
    state = {
        ...defaultUserContext
    }

    componentDidMount() {
        firebase.auth.onAuthStateChanged(user => {
            if(user) {
                this.setState(() => ({ 
                    pendingAuth: false, 
                    isUserSignedIn:true, 
                    id: user.uid, 
                    email: user.email}))
                
                db.userRef(user.uid).onSnapshot(doc => {
                    let user = doc.data();
                    let role = user.role || 'USER'; 
                    let bio = user.bio || null;
                    // console.log(user);
                    this.setState({ 
                        pendingUser: false,
                        name: user.name, 
                        hours: user.hours,
                        bio,
                        role  });
                })
                // db.getUser(user.uid)
                // .then(user => {
                //     let role = user.role || 'USER'; 
                //     let bio = user.bio || null;
                //     console.log(user);
                //     this.setState({ 
                //         pendingUser: false,
                //         name: user.name, 
                //         hours: user.hours,
                //         bio,
                //         role  })
                // })
            }
            else {
                this.setState(() => ({ 
                    pendingAuth: false, 
                    pendingUser: false, 
                    isUserSignedIn: false,
                    id: null, 
                    email: null, 
                    name: 'Guest', 
                    hours: '' }))
            }
        })
    }

    render() {
        const {children} = this.props;
        const user = { ...this.state }
        return (
            <FirebaseAuthUserContext.Provider value={ user }>
                {children}
            </FirebaseAuthUserContext.Provider>
        );
    }
}
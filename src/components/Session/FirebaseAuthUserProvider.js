import React from 'react';

import { firebase, db } from '../../firebase';

import nan from '../../nan.jpg'

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
        this.listener = firebase.auth.onAuthStateChanged(user => {
            if(user) {
                this.setState({ 
                    pendingAuth: false, 
                    isUserSignedIn:true, 
                    id: user.uid, 
                    email: user.email
                });
                
                db.userRef(user.uid)
                .onSnapshot(doc => {
                    let user = doc.data();
                    let role = user.role ? user.role : 'USER'; 
                    let bio = user.bio ? user.bio : null;
                    let image = user.image ? user.image : nan;
                    this.setState({ 
                        pendingUser: false,
                        name: user.name, 
                        hours: user.hours,
                        bio,
                        image,
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
                    hours: '', 
                    role: null,
                    bio: null,
                    image: null,}))
            }
        })
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const {children, ...acyclicalProps} = this.props;
        // const user = { ...this.state }
        console.log('AuthUser: ');
        console.log(this.state);
        return (
            <FirebaseAuthUserContext.Provider value={ this.state }>
                {React.cloneElement(children, acyclicalProps)}
                {/* {React.Children.map(children, child => {
                    return React.cloneElement(child, {
                    ...this.props
                    })
                })} */}
            </FirebaseAuthUserContext.Provider>
        );
    }
}
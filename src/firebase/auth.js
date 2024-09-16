import { auth, db } from './firebase';

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
    auth.signOut()
    .then(data => {console.log(data)});

// Sign up
export const doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password)
    // .then(signUpResult => {
    //     db.createUser(signUpResult.uid)
    //     return signUpResult
    // })

// Change email
export const doUpdateEmail = (email) =>
    auth.currentUser.updateEmail(email)

export const getCurrentUserId = () =>
    auth.currentUser.uid

export const doUpdateProfile = ( profile ) => {
    return db.runTransaction(async (transaction) => {
        const requesterRef = db.collection('users').doc(getCurrentUserId());
        const requesterDoc = await transaction.get(requesterRef);
        if(!requesterDoc.exists) throw Error('User does not exist')
        await transaction.update(requesterRef, profile);
    })
}

export const doUpdatePassword = ( password ) =>
    auth.currentUser.updatePassword( password );

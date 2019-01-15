import { db } from './firebase';

const settings = {timestampsInSnapshots: true};
db.settings(settings);

/** Firebase db module
 * @module firebase/db
 * @see module:firebase/token
 */

/* User Functions */
export const createUser = (id, name, email) => {
    return db.collection("users").doc(id).set({
        name,
        email,
        hours: 0,
    })
}
export const getUsers = () =>
    db.collection("users").get()
    .then(function(querySnapshot) {
        var users = [];
        querySnapshot.forEach(doc => {
            var {hours, name, email} = doc.data();
            users.push({
                id: doc.id,
                name,
                email,
                hours,
            });
        });
        return users;
    });

export const getUser = id =>
    db.collection("users").doc(id).get()
    .then(doc => {
        if (doc.exists) return doc.data();
        else return null;
    });

export const userRef = id => db.collection("users").doc(id);

export const editUserBio = (userId, bio) => {
    const userRef = db.collection("users").doc(userId);
    return userRef.set({
        bio
    }, { merge: true });
}

function updateHoursTransaction(transaction, userRef, amount) {
    return transaction.get(userRef)
    .then(function(userDoc) {
        if (!userDoc.exists) {
            throw Error("Document does not exist!");
        }

        var newHours = userDoc.data().hours + Number(amount);
        return transaction.update(userRef, { hours: newHours });
    })
}




export const logHours = (id, amount) => {
    const userRef = db.collection("users").doc(id);

    return db.runTransaction(transaction => updateHoursTransaction(transaction, userRef, amount))
};

/* Organisation functions*/
export const getOrganisations = () =>
    db.collection("organisations").get()
    .then(function(querySnapshot) {
        var orgs = [];
        querySnapshot.forEach(doc => {
            var {name, hoursGenerated} = doc.data();
            orgs.push({
                id: doc.id,
                name,
                hoursGenerated,
            });
        });
        return orgs;
    });

export const getOrganisation = id =>
    db.collection("organisations").doc(id).get()
    .then(doc => {
        if (doc.exists) return doc.data();
        else return null;
    });

function updateOrgsHoursGenerateTransaction(transaction, orgRef, amount) {
    return transaction.get(orgRef)
    .then((orgDoc) => {
        if (!orgDoc.exists) {
            throw Error("Document does not exist!");
        }

        var newHours = orgDoc.data().hoursGenerated + Number(amount);
        return transaction.update(orgRef, { hoursGenerated: newHours });
    })
}
export const updateDistributedHoursForOrg = (id, amount) => {
    const orgRef = db.collection("organisations").doc(id);
    return db.runTransaction(transaction => 
        updateOrgsHoursGenerateTransaction(transaction, orgRef, amount));
}

/* Transaction functions */
export const createTransaction = (type, from, fromName, to, toName, hours, description, dateCreated) => {
    console.log('Creating transaction');
    return db.collection("transactions").add({
        type,
        from,
        fromName,
        to,
        toName,
        hours,
        description,
        dateCreated,
    })
}
export const getTransactions = () =>
    db.collection("transactions").orderBy("dateCreated", "desc").get()
    .then(function(querySnapshot) {
        var transactions = [];
        querySnapshot.forEach(doc => {
            var {type, from, to, hours, description, fromName, toName, dateCreated} = doc.data();
            transactions.push({
                id: doc.id,
                type, from, fromName, to, toName, hours, description, dateCreated
            });
        });
        return transactions;
    });

/** Get all transactions from firebase, sorted by dateCreated
 * @async
 * @function getEventLog
 * 
 */    
export const getEventLog = () =>
    db.collection('event-log').orderBy("dateCreated", "desc").get()
    .then(querySnapshot => querySnapshot.docs)
    .then(docs => docs.map(doc => ({ docId: doc.id, ...doc.data() })))

export const getEventLogForUser = (userId) => {
    return db.collection('event-log').orderBy("dateCreated", "desc").get()
    .then(querySnapshot => querySnapshot.docs)
    .then(docs => docs.map(doc => ({ docId: doc.id, ...doc.data() })))
    .then(docs => { 
        // console.log(userId);
        // console.log(docs);
        return docs.filter(doc =>
        (doc.details.destination && doc.details.destination.id === userId)
        || (doc.details.source && doc.details.source.id=== userId)     
    )
})
    .catch(console.error);
}
    

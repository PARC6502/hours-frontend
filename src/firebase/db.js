import { db } from './firebase';

/* User Functions */
export const createUser = (id, name, email) => {
    return db.collection("users").doc(id).set({
        name,
        email,
        hours: 0,
        meals: 0,
        photo: null,
    })
}
export const getUsers = () =>
    db.collection("users").get()
    .then(function(querySnapshot) {
        var users = [];
        querySnapshot.forEach(doc => {
            var {hours, name, email, meals, photo} = doc.data();
            users.push({
                id: doc.id,
                name,
                email,
                hours,
                meals,
                photo,
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
            var {name, description, hoursGenerated, mealsProvided, photo} = doc.data();
            orgs.push({
                id: doc.id,
                name,
                description,
                hoursGenerated,
                mealsProvided,
                photo,
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

export const getEventLog = ( type = null, limit = 100 ) => {
    const collection = db.collection( 'event-log' )
        .orderBy( "dateCreated", "desc" )

    if ( type ) {
        collection.where( 'type', '==', type );
    }

    return collection.get()
        .then( querySnapshot => querySnapshot.docs )
        .then( docs => docs.map( doc => ( { docId: doc.id, ...doc.data() } ) ) )
}

export const getEventLogForUser = (userId, type = null) => {
    return getEventLog(type)
    .then(docs => docs.filter(doc =>
        (doc.details.requesterId === userId)
        || (doc.details.requester && doc.details.requester.id === userId)
        || (doc.details.to && doc.details.to.id === userId)
        || (doc.details.from && doc.details.from.id === userId)
    ))
    .catch(console.error);
}

export const getEventLogForOrganisation = (orgId, type = null) => {
    return getEventLog(type)
    .then(docs => docs.filter(doc =>
        (doc.details.fromId === orgId)
        || (doc.details.fromOrg && doc.details.fromOrg.id === orgId)
    ))
    .catch(console.error);
}

import { db } from './firebase';

const settings = {timestampsInSnapshots: true};
db.settings(settings);

function updateHoursTransaction(transaction, userRef, amount) {
    return transaction.get(userRef)
    .then(function(userDoc) {
        if (!userDoc.exists) {
            throw "Document does not exist!";
        }

        var newHours = userDoc.data().hours + Number(amount);
        return transaction.update(userRef, { hours: newHours });
    })
}

function updateOrgsHoursGenerateTransaction(transaction, orgRef, amount) {
    return transaction.get(orgRef)
    .then((orgDoc) => {
        if (!orgDoc.exists) {
            throw "Document does not exist!";
        }

        var newHours = orgDoc.data().hoursGenerated + Number(amount);
        return transaction.update(orgRef, { hoursGenerated: newHours });
    })
}

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
            var {hours, name, email, id} = doc.data();
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


export const sendHoursToUser = (id, amount) => {
    const userRef = db.collection("users").doc(id);

    console.log(`userid: ${id}, amount: ${amount}, typeof amount: ${typeof amount}`);
    return db.runTransaction(transaction => updateHoursTransaction(transaction, userRef, amount))
};

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

export const generateHoursFromOrg = (id, amount) => {
    const orgRef = db.collection("organisations").doc(id);
    return db.runTransaction(transaction => 
        updateOrgsHoursGenerateTransaction(transaction, orgRef, amount));
}

export const createTransaction = (type, from, to, hours, description) => {
    return db.collection("transactions").add({
        type,
        from,
        to,
        hours,
        description
    })
}

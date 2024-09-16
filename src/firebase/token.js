import { db } from './firebase';

const makeTokenEvent = (type, details) => {
    const dateCreated = Date.now();
    return {type, details, dateCreated};
}

const getNewEventLogEntry = () => db.collection("event-log").doc();

const objContains = (obj, fields) => fields.every(field => Object.keys(obj).includes(field))

const isNumberOrStringNumber = n => !isNaN(n) //typeof amount === 'number'
const isNumberish = isNumberOrStringNumber
const isAmountCorrect = amount => isNumberish(amount) && amount > 0

export const sendTokens = async (from, to, details) => {
    if (!objContains(details, ['amount'])) throw Error('Sending amount not provided');

    if (from.id === to.id) throw Error('Trying to send to self.');
    if (!isAmountCorrect(details.amount)) throw Error("Amount has to be a positive number.");
    const fromUserRef = db.collection("users").doc(from.id);
    const toUserRef = db.collection("users").doc(to.id);
    return db.runTransaction(async transaction => {
        const fromUserDoc = await transaction.get(fromUserRef);
        const toUserDoc = await transaction.get(toUserRef);
        if(!fromUserDoc.exists || !toUserDoc.exists) throw Error('Firebase error')
        const fromHours = fromUserDoc.data().hours - Number(details.amount);
        if (fromHours < 0) throw Error('Insufficient funds');
        const toHours = toUserDoc.data().hours + Number(details.amount);
        await transaction.update(fromUserRef, {hours: fromHours});
        await transaction.update(toUserRef, {hours: toHours});

        const eventType = 'SEND_TOKENS';
        const tokenEvent = makeTokenEvent(eventType, {from, to, ...details});
        await transaction.set(getNewEventLogEntry(), tokenEvent);
    })

}

/*
* fromOrg and requester should be objects
* details obj must contain dateOfLabour, description,
*/
export const requestTokens = (fromOrg, requester, details) => {
    // validate fromOrg
    if (!isAmountCorrect(details.loggedHours)) throw Error("Amount of people helped has to be a positive number.");
    if (!isAmountCorrect(details.mealsProvided)) throw Error("Amount of meals provided has to be a positive number.");
    const requestRef = db.collection('token-requests').doc();
    const batch = db.batch();
    const request = {
        fromId: fromOrg.id,
        fromName: fromOrg.name,
        fromPhoto: fromOrg.photo || '',
        requesterId: requester.id,
        requesterName: requester.name,
        requesterPhoto: requester.photo || '',
        tokens: details.loggedHours,
        meals: details.mealsProvided,
        description: details.description,
        photo: details.photo || '',
        dateOfLabour: details.dateOfLabour,
        dateCreated: Date.now(),
    }
    batch.set( requestRef, request );

    const eventType = 'REQUEST_TOKENS';
    const tokenEvent = makeTokenEvent(eventType, { fromOrg, requester, ...details });
    batch.set(getNewEventLogEntry(), tokenEvent);

    return batch.commit();
}

export const approveTokens = (requestId, orgId) => {
    const requestRef = db.collection('token-requests').doc(requestId);
    const orgRef = db.collection('organisations').doc(orgId);
    return db.runTransaction(async (transaction) => {
        const requestDoc = await transaction.get(requestRef);
        const orgDoc = await transaction.get(orgRef);
        if(!requestDoc.exists || !orgDoc.exists) throw Error('Firebase error');
        if(requestDoc.data().fulfilled) throw Error('Request already fulfilled');
        const requesterRef = db.collection('users').doc(requestDoc.data().requesterId);
        const requesterDoc = await transaction.get(requesterRef);
        if(!requesterDoc.exists) throw Error('Firebase error')

        // Note: Tokens is the number of people helped
        const requesterTokens = (requesterDoc.data().hours || 0) + Number(requestDoc.data().tokens);
        const requesterMeals = (requesterDoc.data().meals || 0) + Number(requestDoc.data().meals);
        // Note: Hours is actually the value for number of people helped
        const distributedHours = (orgDoc.data().hoursGenerated || 0) + Number(requestDoc.data().tokens);
        const distributedMeals = (orgDoc.data().mealsProvided || 0) + Number(requestDoc.data().meals);

        await transaction.update(orgRef, {
            hoursGenerated: distributedHours,
            mealsProvided: distributedMeals,
        });
        await transaction.update(requesterRef, {
            hours: requesterTokens,
            meals: requesterMeals,
        });
        await transaction.update(requestRef, {approved: true, fulfilled:true});

        const eventType = 'APPROVE_TOKENS';
        const tokenEvent = makeTokenEvent(eventType, requestDoc.data());
        await transaction.set(getNewEventLogEntry(), tokenEvent);
    })
}

export const rejectTokens = (request, orgId, reason) => {
    if (request.fulfilled) return Promise.reject(Error('Request already fulfilled'))
    const requestRef = db.collection('token-requests').doc(request.docId);
    const batch = db.batch();
    batch.update(requestRef, {rejected: true, fulfilled: true});

    const eventType = 'REJECT_TOKENS';
    // TODO: add more info to event log
    const tokenEvent = makeTokenEvent(eventType, {requestId: request.docId, rejectionReason: reason});
    batch.set(getNewEventLogEntry(), tokenEvent);

    return batch.commit()
}

export const spendTokens = (from, on, details) => {
    return Error('function unimplemented');
}

export const getRequests = () =>
    db.collection('token-requests').orderBy("dateCreated", "desc").get()
    .then(querySnapshot => querySnapshot.docs)
    .then(docs => docs.map(doc => ({ docId: doc.id, ...doc.data() })))

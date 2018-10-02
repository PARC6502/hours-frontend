import { db } from './firebase';

const makeTokenEvent = (type, details) => {
    const dateCreated = Date.now();
    return {type, details, dateCreated};
}

const getNewEventLogEntry = () => db.collection("event-log").doc();

const objContains = (obj, fields) => fields.every(field => Object.keys(obj).includes(field));

const isNumberOrStringNumber = n => !isNaN(n) //typeof amount === 'number'
const isNumberish = isNumberOrStringNumber
const isAmountCorrect = amount => isNumberish(amount) && amount > 0

/** Sends tokens from one user to another user
 * @param {Object} obj Input object containing source, destination, description and amount
 * @param {Object} obj.source Object describing user sending the tokens
 * @param {String} obj.source.type Presumably this will always be 'User' for this function
 * @param {String} obj.source.id j
 * @param {String} obj.source.name j
 * @param {Object} obj.destination Object describing user recieving the tokens
 * @param {String} obj.description j
 * @param {Number} obj.amount j
 */
export const sendTokens = async ({source, destination, description, amount}) => {
    if (amount === 'undefined') throw Error('Sending amount not provided');
    
    if (source.id === destination.id) throw Error('Trying to send to self.');
    if (!isAmountCorrect(amount)) throw Error("Amount has to be a positive number.");
    const fromUserRef = db.collection("users").doc(source.id);
    const toUserRef = db.collection("users").doc(destination.id);
    return db.runTransaction(async transaction => {
        const fromUserDoc = await transaction.get(fromUserRef);
        const toUserDoc = await transaction.get(toUserRef);
        if(!fromUserDoc.exists || !toUserDoc.exists) throw Error('Firebase error')
        const fromHours = fromUserDoc.data().hours - Number(amount);
        if (fromHours < 0) throw Error('Insufficient funds');
        const toHours = toUserDoc.data().hours + Number(amount);
        await transaction.update(fromUserRef, {hours: fromHours});
        await transaction.update(toUserRef, {hours: toHours});

        const eventType = 'SEND_TOKENS';
        const tokenEvent = makeTokenEvent(eventType, {source, destination, description, amount});
        await transaction.set(getNewEventLogEntry(), tokenEvent);
    })

}

/* 
* fromOrg and requester should be objects
* details obj must contain dateOfLabour, description, 
*/
export const requestTokens = (fromOrg, requester, details) => {
    // validate fromOrg
    if (!isAmountCorrect(details.loggedHours)) throw Error("Amount has to be a positive number.");
    const requestRef = db.collection('token-requests').doc();
    const batch = db.batch();
    const request = {
        fromId: fromOrg.id,
        fromName: fromOrg.name,
        requesterId: requester.id,
        requesterName: requester.name,
        tokens: details.loggedHours,
        description: details.description,
        dateOfLabour: details.dateOfLabour,
        dateCreated: Date.now(),
    }
    batch.set(requestRef, request);

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

        const requesterTokens = requesterDoc.data().hours + Number(requestDoc.data().tokens);
        const distributedHours = orgDoc.data().hoursGenerated + Number(requestDoc.data().tokens);
        
        await transaction.update(orgRef, {hoursGenerated: distributedHours});
        await transaction.update(requesterRef, {hours: requesterTokens});
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
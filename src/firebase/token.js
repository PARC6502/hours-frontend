import { db } from './firebase';

const makeTokenEvent = (type, details) => {
    const dateCreated = Date.now();
    return {type, details, dateCreated};
}

const getNewEventLogEntry = () => db.collection("event-log").doc();

// const objContains = (obj, fields) => fields.every(field => Object.keys(obj).includes(field));

const isNumberOrStringNumber = n => !isNaN(n) //typeof amount === 'number'
const isNumberish = isNumberOrStringNumber
const isAmountCorrect = amount => isNumberish(amount) && amount > 0

/** Token firebase module
 * @module firebase/token
 */

/** Sends tokens from one user to another user 
 * @function sendTokens
 * 
 * @param {Object} sendEvent
 * @param {Object} sendEvent.source Object describing user sending the tokens
 * @param {String} sendEvent.source.type Presumably this will always be 'User' for this function
 * @param {String} sendEvent.source.id j
 * @param {String} sendEvent.source.name j
 * @param {Object} sendEvent.destination Object describing user recieving the tokens
 * @param {String} sendEvent.description j
 * @param {Number} sendEvent.amount j
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

/** User (destination) requests tokens from Organisation (source)
 * @function requestTokens
 * 
* @param {Object} obj Input object containing source, destination, description and amount
* @param {Object} obj.fromOrg Organisation hours are requested from
* @param {Object} obj.requester User requesting the tokens
* @param {String} obj.description What the tokens are requested for
* @param {Date} obj.dateOfLabour The date the work was done
* @param {Number} obj.loggedHours Amount of tokens being requested/logged
*/
export const requestTokens = async ({fromOrg, requester, description, dateOfLabour, loggedHours}) => {
    // validate fromOrg
    if (!isAmountCorrect(loggedHours)) throw Error("Amount has to be a positive number.");
    const requestRef = db.collection('token-requests').doc();
    const batch = db.batch();
    const request = {
        source: fromOrg,
        destination: requester,
        amount: loggedHours,
        description: description,
        dateOfLabour: dateOfLabour,
        dateCreated: Date.now(),
    }
    batch.set(requestRef, request);

    const eventType = 'REQUEST_TOKENS';
    const tokenEvent = makeTokenEvent(eventType, { ...request });
    batch.set(getNewEventLogEntry(), tokenEvent);

    return batch.commit();
}

export const approveTokens = (requestId, orgId, approvalComment='') => {
    const requestRef = db.collection('token-requests').doc(requestId);
    const orgRef = db.collection('organisations').doc(orgId);
    return db.runTransaction(async (transaction) => {
        const requestDoc = await transaction.get(requestRef);
        const orgDoc = await transaction.get(orgRef);
        if(!requestDoc.exists || !orgDoc.exists) throw Error('Firebase error');
        if(requestDoc.data().fulfilled) throw Error('Request already fulfilled');
        const requesterRef = db.collection('users').doc(requestDoc.data().destination.id);
        const requesterDoc = await transaction.get(requesterRef);
        if(!requesterDoc.exists) throw Error('Firebase error')

        const requesterTokens = requesterDoc.data().hours + Number(requestDoc.data().amount);
        const distributedHours = orgDoc.data().hoursGenerated + Number(requestDoc.data().amount);
        
        await transaction.update(orgRef, {hoursGenerated: distributedHours});
        await transaction.update(requesterRef, {hours: requesterTokens});
        await transaction.update(requestRef, {approved: true, fulfilled:true});

        const eventType = 'APPROVE_TOKENS';
        const { source, destination, description: requestDescription ,amount, dateOfLabour } = requestDoc.data();
        const approval = {
            requestId,
            source,
            destination,
            amount,
            description: approvalComment,
            requestDescription,
            dateOfLabour,
        };
        const tokenEvent = makeTokenEvent(eventType, { ...approval });
        await transaction.set(getNewEventLogEntry(), tokenEvent);
    })
}

export const rejectTokens = (request, orgId, reason) => {
    if (request.fulfilled) return Promise.reject(Error('Request already fulfilled'))
    const requestRef = db.collection('token-requests').doc(request.docId);
    const batch = db.batch();
    batch.update(requestRef, {rejected: true, fulfilled: true, rejectionReason: reason});

    const eventType = 'REJECT_TOKENS';
    const { docId, source, destination, amount, dateOfLabour, description: requestDescription } = request;
    const rejection = {
        requestId: docId,
        source,
        destination,
        amount,
        description: reason,
        requestDescription,
        dateCreated: Date.now(),
    };
    const tokenEvent = makeTokenEvent(eventType, {...rejection});
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
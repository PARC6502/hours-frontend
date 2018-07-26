import { db } from './firebase';
import { assert } from '../../node_modules/@firebase/util';

const addToEventLog = (transaction, tokenEvent)

export const sendTokensToUser = (fromId, toId, amount) => {
    if (fromId === toId) return Promise.reject(Error('Trying to send to self.'));
    if (amount <= 0) return Promise.reject(Error("Can't send negative amount"));
    const fromUserRef = db.collection("users").doc(fromId);
    const toUserRef = db.collection("users").doc(toId);
    return db.runTransaction(async transaction => {
        const fromUserDoc = await transaction.get(fromUserRef);
        const toUserDoc = await transaction.get(toUserRef);
        if(!fromUserDoc.exists || !toUserDoc.exists) throw Error('Firebase error')
        const fromHours = fromUserDoc.data().hours - Number(amount);
        if (fromHours < 0) throw Error('Insufficient funds');
        const toHours = toUserDoc.data().hours + Number(amount);
        await transaction.update(fromUserRef, {hours: fromHours});
        await transaction.update(toUserRef, {hours: toHours});
    })
};

objContains = (obj, fields) => fields.every(field => Object.keys(obj).includes(field))

export const sendTokens = async (from, to, details) => {
    if (!objContains(details, ['amount'])) throw Error('Sending amount not provided');
    if (from.id === to.id) throw Error('Trying to send to self.');
    if (details.amount <= 0) throw Error("Can't send negative amount");
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
    })

}

/* 
* fromOrg and requester should be objects
* details obj must contain dateOfLabour, description, 
*/
export const requestTokens = (fromOrg, requester, details) => {
    // validate fromOrg
    const requestRef = db.collection('token-request').doc(fromOrg.id).collection('requests').doc();
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
    return batch.commit();
}

export const approveTokens = (requestId, orgId) => {
    const requestRef = db.collection('token-request').doc(orgId).collection('requests').doc(requestId);
    const orgRef = db.collection('organisations').doc(orgId);
    return db.runTransaction(async transaction => {
        const requestDoc = await transaction.get(requestRef);
        const orgDoc = await transaction.get(orgRef);
        if(!requestDoc.exists || !orgDoc.exists) throw Error('Firebase error')

        const requesterRef = db.collection('users').doc(requestDoc.data().requesterId);
        const requesterDoc = await transaction.get(requesterRef);
        if(requesterDoc.exists) throw Error('Firebase error')

        const requesterTokens = requesterDoc.data().hours + Number(requestDoc.data().tokens);
        const distributedHours = orgDoc.data().hoursGenerated + Number(requestDoc.data().tokens);
        
        await transaction.update(orgRef, {hoursGenerated: distributedHours});
        await transaction.update(requesterRef, {hours: requesterTokens});
        await transaction.update(requestRef, {approved: true, fulfilled:true});
    })
}

export const rejectTokens = (requestId, reason) => {
    const requestRef = db.collection('token-request').doc(fromOrg.id).collection('requests').doc(requestId);
    return requestRef.update({rejected: true, fulfilled: true});
}

export const spendTokens = (from, on, details) => {
    return Error('function unimplemented');
}
import { db } from './firebase';

export const createOrganisation = (name, description) =>
    db.collection('organisations').add({
        name,
        description,
        hoursGenerated: 0,
        mealsProvided: 0,
    })

export const updateOrganisation = (id, data) => {
    return db.runTransaction(async (transaction) => {
        const orgRef = db.collection('organisations').doc(id);
        const orgDoc = await transaction.get(orgRef);
        if(!orgDoc.exists) throw Error('Organisation does not exist')
        await transaction.update(orgRef, data);
    })
}

import { db } from './firebase';

export const createOrganisation = (name, description) =>
    db.collection('organisations').add({
        name, 
        description,
        hoursGenerated: 0,
    })


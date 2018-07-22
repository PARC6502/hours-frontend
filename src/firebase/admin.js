import { db } from './firebase';

export const createOrganisation = (name, description) =>
    db.collections('organisations').add({
        name, 
        description,
        hoursGenerated: 0,
    })


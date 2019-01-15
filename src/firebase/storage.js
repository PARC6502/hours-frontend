import { storage } from './firebase';

export const uploadUserImage = (userId, image) => {
    const storageRef = storage.ref(userId + '/profile.jpg');
    return storageRef.put(image)
}
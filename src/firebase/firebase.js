import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyAZmqwHUq7aQulTVDzklYfGwOkOrcJFuYU",
  authDomain: "hours-website.firebaseapp.com",
  databaseURL: "https://hours-website.firebaseio.com",
  projectId: "hours-website",
  storageBucket: "hours-website.appspot.com",
  messagingSenderId: "858246670779"
};

if (!firebase.apps.length)
  firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

export {
  auth,
  db,
};
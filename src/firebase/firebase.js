import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyALkT38ls4fTUMAm43tQcnMb-6Ps0H0wG0",
  authDomain: "easa-money.firebaseapp.com",
  databaseURL: "https://easa-money.firebaseio.com",
  projectId: "easa-money",
  storageBucket: "",
  messagingSenderId: "479879861595"
};

if (!firebase.apps.length)
  firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

export {
  auth,
  db,
};
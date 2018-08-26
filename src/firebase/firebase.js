import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

const devConfig = {
  apiKey: "AIzaSyAZmqwHUq7aQulTVDzklYfGwOkOrcJFuYU",
  authDomain: "hours-website.firebaseapp.com",
  databaseURL: "https://hours-website.firebaseio.com",
  projectId: "hours-website",
  storageBucket: "hours-website.appspot.com",
  messagingSenderId: "858246670779"
};

const prodConfig = {
  apiKey: "AIzaSyCyBJu1Sbr_cKut_gKfKbue1vXLYl--rEU",
  authDomain: "hours-production.firebaseapp.com",
  databaseURL: "https://hours-production.firebaseio.com",
  projectId: "hours-production",
  storageBucket: "hours-production.appspot.com",
  messagingSenderId: "732480702691"
};

console.log(process.env);

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length)
  firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

export {
  auth,
  db,
};
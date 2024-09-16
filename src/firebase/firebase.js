import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAhApjVBQOuAt24h9b0OaI1zxiZ3bYw9S4",
  authDomain: "hours-website1.firebaseapp.com",
  databaseURL: "https://hours-website1.firebaseio.com",
  projectId: "hours-website1",
  storageBucket: "hours-website1.appspot.com",
  messagingSenderId: "575700657945",
  appId: "1:575700657945:web:4c4c39c1ba891293130788",
  measurementId: "G-JWJ9ER7BE3"
};

if (!firebase.apps.length) firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };

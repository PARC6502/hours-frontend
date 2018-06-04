import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyAZmqwHUq7aQulTVDzklYfGwOkOrcJFuYU",
    authDomain: "hours-website.firebaseapp.com",
    databaseURL: "https://hours-website.firebaseio.com",
    projectId: "hours-website",
    storageBucket: "hours-website.appspot.com",
    messagingSenderId: "858246670779"
  };
var fire = firebase.initializeApp(config);
export default fire;
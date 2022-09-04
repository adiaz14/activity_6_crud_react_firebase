import firebase from "firebase/app";
import 'firebase/firestore'

//Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBqHkjh7JfhzuLo1h-p9LTzu4OkjSn6lmA",
    authDomain: "crud-react-firebase-1ce31.firebaseapp.com",
    projectId: "crud-react-firebase-1ce31",
    storageBucket: "crud-react-firebase-1ce31.appspot.com",
    messagingSenderId: "1071594512876",
    appId: "1:1071594512876:web:0d0495d5117a7b825b60c9",
    measurementId: "G-Y7RXGCSQ82"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);
export { firebase };
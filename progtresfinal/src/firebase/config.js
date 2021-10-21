// Import the functions you need from the SDKs you need
import app from "firebase/app"
import firebase from "firebase"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBajNrp42DyXJnJBJfIXhl5Wx78HkQpgV0",
  authDomain: "rn-udesa-68cff.firebaseapp.com",
  projectId: "rn-udesa-68cff",
  storageBucket: "rn-udesa-68cff.appspot.com",
  messagingSenderId: "878623729569",
  appId: "1:878623729569:web:82c95b551e5a6c2bd78de0"
};

// Initialize Firebase
app.initializeApp(firebaseConfig)

export const auth=firebase.auth()
export const storage=app.storage()
export const db=app.firestore()
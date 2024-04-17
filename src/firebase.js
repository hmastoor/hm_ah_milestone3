// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXxsgYPK8JjiQWVl3y62ut8Bt0jPuemGk",
    authDomain: "criate-content-creation.firebaseapp.com",
    projectId: "criate-content-creation",
    storageBucket: "criate-content-creation.appspot.com",
    messagingSenderId: "843674212380",
    appId: "1:843674212380:web:6f6d726d6836ef588667d9"
};

let firebaseApp
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
}

export default firebaseApp;
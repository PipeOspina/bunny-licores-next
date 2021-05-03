import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE__API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE__AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE__PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE__STORAGE_BUTCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE__MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE__APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE__MESAUREMENT_ID,
}

export let app: firebase.app.App;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}

export const googleProvider = new firebase.auth.GoogleAuthProvider();
firebase.auth().useDeviceLanguage();

export const db = firebase.firestore();
export const storage = firebase.storage();

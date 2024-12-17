import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, remove, onValue, onChildAdded, update } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA-wDA47zDd_HlFcrErINORpTeqX0xyy7Y",
    authDomain: "fyp-19b08.firebaseapp.com",
    databaseURL: "https://fyp-19b08-default-rtdb.firebaseio.com",
    projectId: "fyp-19b08",
    storageBucket: "fyp-19b08.appspot.com",
    messagingSenderId: "118594307835",
    appId: "1:118594307835:web:1dbb4fc1ae6c6d9d3a525e",
    measurementId: "G-0Q2717NT3L"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, push, remove, onValue, onChildAdded, update };


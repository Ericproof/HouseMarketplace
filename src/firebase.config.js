// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBr7mKrJrmw0Bv0KxfRiuvrLRM33SVaqko',
	authDomain: 'house-marketplace-app-1df42.firebaseapp.com',
	projectId: 'house-marketplace-app-1df42',
	storageBucket: 'house-marketplace-app-1df42.appspot.com',
	messagingSenderId: '289727124098',
	appId: '1:289727124098:web:9c5c9e6c7b03fe41a71a9b',
	measurementId: 'G-MCD78RSSBJ'
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore();

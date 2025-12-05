// Firebase configuration is currently disabled to allow the application to run
// without external dependencies or build errors related to the firebase SDK.
// Storage logic has been moved to services/storageService.ts using LocalStorage.

// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// // Neka Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDWpMzBfZbzjKcc7_pxsvQDEescE_K2GDo",
//   authDomain: "neka-45b49.firebaseapp.com",
//   projectId: "neka-45b49",
//   storageBucket: "neka-45b49.firebasestorage.app",
//   messagingSenderId: "204677015158",
//   appId: "1:204677015158:web:28298149aeb7fb2d4e2157",
//   measurementId: "G-M07MG1H33B"
// };

// console.log("Initializing Firebase (Modular v9+)...");

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// console.log("Firestore Initialized");

export const db = {};

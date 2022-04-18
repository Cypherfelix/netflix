import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBDZqy6I9yMa0jpZEX0Yu2a3OljeVjEeAg',
  authDomain: 'netflix-clone-d8c3d.firebaseapp.com',
  projectId: 'netflix-clone-d8c3d',
  storageBucket: 'netflix-clone-d8c3d.appspot.com',
  messagingSenderId: '813198936788',
  appId: '1:813198936788:web:bdc03fcb65b4ad5799c941',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }

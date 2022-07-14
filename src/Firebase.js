import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCDoyA1ivYaRv0Jw43bHftbMVu_e55-aRA',
  authDomain: 'photo-tagging-game-287d2.firebaseapp.com',
  projectId: 'photo-tagging-game-287d2',
  storageBucket: 'photo-tagging-game-287d2.appspot.com',
  messagingSenderId: '491535627401',
  appId: '1:491535627401:web:c6b3b596c52074112b0258',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

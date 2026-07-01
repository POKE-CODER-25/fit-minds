import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig.js'

const authMessages = {
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Enter your password.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/user-not-found': 'No account was found for this email.',
  'auth/weak-password': 'Use a stronger password with at least 6 characters.',
  'auth/wrong-password': 'Email or password is incorrect.',
}

export function getAuthErrorMessage(error) {
  return authMessages[error?.code] || 'Something went wrong. Please try again.'
}

export function signupWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logoutUser() {
  return signOut(auth)
}

export function sendResetEmail(email) {
  return sendPasswordResetEmail(auth, email)
}

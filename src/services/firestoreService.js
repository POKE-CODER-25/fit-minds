import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig.js'

const fitnessProfileCollection = 'fitnessProfiles'

export async function getFitnessProfile(uid) {
  const profileRef = doc(db, fitnessProfileCollection, uid)
  const profileSnap = await getDoc(profileRef)

  if (!profileSnap.exists()) {
    return null
  }

  return {
    id: profileSnap.id,
    ...profileSnap.data(),
  }
}

export async function createFitnessProfile(uid, email, profile) {
  const profileRef = doc(db, fitnessProfileCollection, uid)
  await setDoc(profileRef, {
    uid,
    email,
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateFitnessProfile(uid, profile) {
  const profileRef = doc(db, fitnessProfileCollection, uid)
  await updateDoc(profileRef, {
    ...profile,
    updatedAt: serverTimestamp(),
  })
}

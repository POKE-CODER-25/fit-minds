import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { AuthContext } from './AuthContext.js'
import { auth } from '../firebase/firebaseConfig.js'
import { getFitnessProfile } from '../services/firestoreService.js'

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  async function refreshProfile(uid = currentUser?.uid) {
    if (!uid) {
      setProfile(null)
      return null
    }

    setProfileLoading(true)
    try {
      const latestProfile = await getFitnessProfile(uid)
      setProfile(latestProfile)
      return latestProfile
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const existingProfile = await getFitnessProfile(user.uid)
        setProfile(existingProfile)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      profile,
      profileLoading,
      refreshProfile,
    }),
    [currentUser, loading, profile, profileLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider

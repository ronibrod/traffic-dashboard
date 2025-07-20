import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import axios from 'axios'
import { auth } from '../firebase.js'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [initialLoad, setInitialLoad] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        try {
          const { data } = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUser(data)
        } catch (err) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setInitialLoad(true)
    })

    return () => unsubscribe()
  }, [])

  const signin = useCallback(async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(data)
      setAuthError(null)
      return data
    } catch (error) {
      setUser(null)
      setAuthError(error)
      throw error
    }
  }, [])

  const signup = useCallback(async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(data)
      setAuthError(null)
      return data
    } catch (error) {
      setUser(null)
      setAuthError(error)
      throw error
    }
  }, [])

  const signout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <UserContext.Provider
      value={{
        user,
        initialLoad,
        isAdmin,
        signin,
        signup,
        signout,
        authError,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

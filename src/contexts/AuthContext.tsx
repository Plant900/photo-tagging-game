import React, { createContext, useContext, useState } from 'react'
import { auth, provider } from '../Firebase'
import { signInWithPopup, User, signOut, getAuth } from 'firebase/auth'

type AuthContextProviderProps = {
  children: React.ReactNode
}

export const AuthContext = React.createContext<{
  user: User | null
  signInWithGoogle: any
  logOut: any
}>(null as any)

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null)

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider)
    setUser(result.user)
  }

  const logOut = async () => {
    await signOut(auth)
    console.log(auth.currentUser)
    setUser(auth.currentUser)
  }

  const value = {
    user,
    signInWithGoogle,
    logOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

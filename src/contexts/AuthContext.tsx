import React, { createContext, useContext, useState } from 'react'
import { auth, provider } from '../Firebase'
import { signInWithPopup, User } from 'firebase/auth'

type AuthContextProviderProps = {
  children: React.ReactNode
}

export const AuthContext = React.createContext<{
  user: User | null
  signInWithGoogle: any
}>(null as any)

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState(null)

  const signInWithGoogle = async () => {
    const credential = await signInWithPopup(auth, provider)
  }

  const value = {
    user,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import '../App.css'

function App() {
  const context = useContext(AuthContext)

  return (
    <div className="App">
      <button onClick={context.signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

export default App

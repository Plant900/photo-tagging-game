import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { ImageContainer } from './ImageContainer'
import '../App.css'

function App() {
  const context = useContext(AuthContext)

  return (
    <div className="App">
      <button onClick={context.signInWithGoogle}>Sign in with Google</button>
      <div>
        <ImageContainer url="../images/photo-tagging-egor-klyuchnyk1.jpg" />
      </div>
    </div>
  )
}

export default App

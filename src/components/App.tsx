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
        <ImageContainer url="https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497" />
      </div>
    </div>
  )
}

export default App

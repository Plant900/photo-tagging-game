import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { ImageContainer } from './ImageContainer'
import { Scoreboard } from './Scoreboard'
import { PictureSelector } from './PictureSelector'
import '../App.css'

type TimerProps = {
  isTimerActive: boolean
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>
  timerSeconds: Number
  setTimerSeconds: React.Dispatch<React.SetStateAction<number>>
}
export const TimerContext = createContext<TimerProps>(null as any)

type GameStatusProps = {
  isGameWon: boolean
  setIsGameWon: React.Dispatch<React.SetStateAction<boolean>>
}
export const GameStatus = createContext<GameStatusProps>(null as any)

type CharacterInfo = {
  height: Number
  width: Number
  x: Number
  y: Number
}
type GuessStatus = {
  character: CharacterInfo
  name: string
  hasBeenGuessed: boolean
}[]
export const GuessStatus = createContext<{
  guessStatus: GuessStatus
  setGuessStatus: React.Dispatch<React.SetStateAction<GuessStatus>>
}>(null as any)

function App() {
  const { user, signInWithGoogle } = useContext(AuthContext)

  let [isGameWon, setIsGameWon] = useState(false)

  let [guessStatus, setGuessStatus] = useState<GuessStatus>([])

  let [isTimerActive, setIsTimerActive] = useState(false)
  let [timerSeconds, setTimerSeconds] = useState(0)

  let [pictureSelection, setPictureSelection] = useState<string | null>(null)

  return (
    <TimerContext.Provider
      value={{ isTimerActive, setIsTimerActive, timerSeconds, setTimerSeconds }}
    >
      <GameStatus.Provider value={{ isGameWon, setIsGameWon }}>
        <GuessStatus.Provider value={{ guessStatus, setGuessStatus }}>
          <BrowserRouter>
            <div className="header-links">
              <Link className={'header-link'} to="/photo-tagging-game">
                Play
              </Link>
              <Link className={'header-link'} to="/photo-tagging-game/scores">
                Scoreboard
              </Link>
            </div>
            <div className="App">
              <div className="header-buttons">
                <button
                  onClick={() => {
                    setPictureSelection(null)
                    setIsGameWon(false)
                    setGuessStatus([])
                    setTimerSeconds(0)
                  }}
                >
                  Choose Game
                </button>
                <button onClick={signInWithGoogle}>Sign in with Google</button>
              </div>

              <Routes>
                <Route
                  path="/photo-tagging-game"
                  element={
                    pictureSelection ? (
                      <ImageContainer url="https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497" />
                    ) : (
                      <PictureSelector
                        setPictureSelection={setPictureSelection}
                      />
                    )
                  }
                />
                <Route
                  path="/photo-tagging-game/scores"
                  element={<Scoreboard />}
                />
              </Routes>
            </div>
          </BrowserRouter>
        </GuessStatus.Provider>
      </GameStatus.Provider>
    </TimerContext.Provider>
  )
}

export default App

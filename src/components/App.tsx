import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { ImageContainer } from './ImageContainer'
import { Scoreboard } from './Scoreboard'
import { PictureSelector } from './PictureSelector'
import '../App.css'
import { LevelCreator } from './LevelCreator'

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

export type CharacterInfo = {
  height: Number
  width: Number
  x: Number
  y: Number
}
export type GuessStatus = {
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
  let [pictureSelection, setPictureSelection] = useState<{
    url: string
    title: string
    gamemode: number
  } | null>(null)

  return (
    <TimerContext.Provider
      value={{ isTimerActive, setIsTimerActive, timerSeconds, setTimerSeconds }}
    >
      <GameStatus.Provider value={{ isGameWon, setIsGameWon }}>
        <GuessStatus.Provider value={{ guessStatus, setGuessStatus }}>
          <BrowserRouter>
            <nav className="header-links">
              <NavLink className={'header-link'} to="photo-tagging-game">
                Play
              </NavLink>
              <NavLink className={'header-link'} to="photo-tagging-game/scores">
                Scoreboard
              </NavLink>
              <NavLink
                to={'photo-tagging-game/level-creator'}
                className="header-button"
              >
                Level Creator
              </NavLink>
              <div className="header-buttons">
                <Link
                  to="photo-tagging-game"
                  className="header-button choose-game-button"
                  onClick={() => {
                    setPictureSelection(null)
                    setIsGameWon(false)
                    setGuessStatus([])
                    setTimerSeconds(0)
                  }}
                >
                  Choose game
                </Link>
                <button className="header-button" onClick={signInWithGoogle}>
                  Sign in with Google
                </button>
                <div className="user-info-div">
                  {user ? `Signed in as ${user.displayName}` : 'Not signed in'}
                </div>
              </div>
            </nav>
            <div className="App">
              <Routes>
                <Route
                  path="photo-tagging-game"
                  element={
                    pictureSelection ? (
                      <ImageContainer
                        url={pictureSelection.url}
                        title={pictureSelection.title}
                        gamemode={pictureSelection.gamemode}
                      />
                    ) : (
                      <PictureSelector
                        setPictureSelection={setPictureSelection}
                      />
                    )
                  }
                />
                <Route
                  path="photo-tagging-game/scores"
                  element={
                    pictureSelection ? (
                      <Scoreboard
                        title={pictureSelection.title}
                        gamemode={pictureSelection.gamemode}
                      />
                    ) : (
                      <PictureSelector
                        setPictureSelection={setPictureSelection}
                      />
                    )
                  }
                />
                <Route
                  path="photo-tagging-game/level-creator"
                  element={<LevelCreator />}
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

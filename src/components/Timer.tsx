import React, { useEffect, useContext } from 'react'
import { GameStatus, TimerContext } from './App'
import { useState } from 'react'
import '../styles/Timer.css'
import '@fontsource/russo-one'

export const Timer = () => {
  let { isTimerActive, setIsTimerActive, timerSeconds, setTimerSeconds } =
    useContext(TimerContext)
  let { isGameWon } = useContext(GameStatus)

  let toggle = () => {
    setIsTimerActive((isTimerActive = !isTimerActive))
  }

  useEffect(() => {
    if (!isGameWon) {
      setIsTimerActive(true)
    }
  }, [])

  useEffect(() => {
    let interval: any = undefined

    if (isTimerActive) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTimerActive])

  return (
    <div className="timer-container">
      <div>{`${timerSeconds}`}</div>
    </div>
  )
}

import { useEffect, useContext } from 'react'
import { GameStatus, TimerContext } from './App'
import styles from '../styles/Timer.module.css'
import '@fontsource/russo-one'

export const Timer = () => {
  let { isTimerActive, setIsTimerActive, timerSeconds, setTimerSeconds } =
    useContext(TimerContext)
  let { isGameWon } = useContext(GameStatus)

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
    <div className={styles.container}>
      <div>{`${timerSeconds}`}</div>
    </div>
  )
}

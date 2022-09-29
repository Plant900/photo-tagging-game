import React, { useEffect, useState } from 'react'
import { db } from '../Firebase'
import { collection, getDocs } from 'firebase/firestore'
import styles from '../styles/Scoreboard.module.css'

type PlayerScores = {
  name: string
  time: number
}[]

type ScoreboardProps = {
  title: string | null
  levelID: string
  gamemode: number | null
}

export const Scoreboard = ({ title, levelID, gamemode }: ScoreboardProps) => {
  let [playerScores, setPlayerScores] = useState<PlayerScores>()

  useEffect(() => {
    let getPlayerScores = async () => {
      let scores = await getDocs(
        collection(db, `art/${levelID}/${gamemode}/data/scores`)
      )

      let scoreArray: any = []
      scores.forEach((score) => scoreArray.push(score.data()))
      scoreArray.sort((obj1: any, obj2: any) => obj1.time > obj2.time)

      setPlayerScores(scoreArray)
    }
    getPlayerScores().catch((message) => console.log('didnt work'))
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {title} | Level {`${Number(gamemode) + 1}`}
      </div>
      {playerScores ? (
        playerScores.map((score) => {
          return <div key={score.name}>{`${score.name}: ${score.time}`}</div>
        })
      ) : (
        <div>No scores</div>
      )}
    </div>
  )
}

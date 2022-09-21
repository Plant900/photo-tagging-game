import React, { useEffect, useState } from 'react'
import { db } from '../Firebase'
import { collection, getDocs } from 'firebase/firestore'
import '../styles/Scoreboard.css'

type PlayerScores = {
  name: string
  time: number
}[]

type ScoreboardProps = {
  title: string | null
  gamemode: number | null
}

export const Scoreboard = ({ title, gamemode }: ScoreboardProps) => {
  let [playerScores, setPlayerScores] = useState<PlayerScores>()

  useEffect(() => {
    let getPlayerScores = async () => {
      let scores = await getDocs(
        collection(db, `art/${title}/${gamemode}/data/scores`)
      )
      let scoreArray: any = []
      scores.forEach((score) => scoreArray.push(score.data()))
      setPlayerScores(scoreArray)
    }
    getPlayerScores().catch((message) => console.log('didnt work'))
  }, [])

  return (
    <div className="scoreboard-container">
      {playerScores ? (
        playerScores.map((score: { name: string; time: number }) => {
          return <div key={score.name}>{`${score.name}: ${score.time}`}</div>
        })
      ) : (
        <div>No scores</div>
      )}
    </div>
  )
}

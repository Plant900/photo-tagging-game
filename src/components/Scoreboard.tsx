import React, { useEffect, useState } from 'react'
import { db } from '../Firebase'
import { collection, getDocs } from 'firebase/firestore'

type PlayerScores = {
  name: string
  time: number
}[]

export const Scoreboard = () => {
  let [playerScores, setPlayerScores] = useState<PlayerScores>()

  useEffect(() => {
    let getPlayerScores = async () => {
      let scores = await getDocs(collection(db, 'scores'))
      let scoreArray: any = []
      scores.forEach((score) => scoreArray.push(score.data()))
      setPlayerScores(scoreArray)
    }
    getPlayerScores().catch((message) => console.log('didnt work'))
    console.log(playerScores)
  }, [])

  return (
    <div>
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

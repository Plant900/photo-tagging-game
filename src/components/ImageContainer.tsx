import React, { useContext, useEffect, useState } from 'react'
import { getDocs, collection, doc, setDoc } from 'firebase/firestore'
import { GameStatus, GuessStatus, TimerContext } from './App'
import { db } from '../Firebase'
import '../styles/Main.css'
import { AuthContext } from '../contexts/AuthContext'
import { Timer } from './Timer'
import { Scoreboard } from './Scoreboard'

type ImageContainerProps = {
  url: string
}

type GuessArea = {
  x: Number
  y: Number
}

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

export const ImageContainer = ({ url }: ImageContainerProps) => {
  let [guessArea, setGuessArea] = useState<GuessArea>({ x: 0, y: 0 })

  let { setIsTimerActive, timerSeconds } = useContext(TimerContext)
  let { user } = useContext(AuthContext)
  let { setIsGameWon } = useContext(GameStatus)
  let { guessStatus, setGuessStatus } = useContext(GuessStatus)

  const locationsRef = collection(db, 'characterLocations')

  let checkGuess = async ({ x, y }: GuessArea) => {
    let characterLocations = await getDocs(locationsRef)

    characterLocations.docs.map((doc) => {
      let characterData = doc.data()

      if (
        x < characterData.x + characterData.width &&
        x > characterData.x - characterData.width &&
        y < characterData.y + characterData.height &&
        y > characterData.x - characterData.width
      ) {
        console.log('within bounds')

        let updatedGuessStatus = [...guessStatus]
        let index = updatedGuessStatus.findIndex((item) => item.name === doc.id)
        updatedGuessStatus[index].hasBeenGuessed = true

        setGuessStatus(updatedGuessStatus)
      } else {
        console.log('out of bounds')
      }
    })
  }

  useEffect(() => {
    console.log(guessArea)
    checkGuess(guessArea)
  }, [guessArea])

  useEffect(() => {
    let setScore = async () => {
      if (user) {
        let uid = user.uid

        await setDoc(
          doc(db, 'scores', uid),
          { name: String(user.displayName), time: timerSeconds },
          { merge: true }
        )
      }
    }

    if (
      guessStatus.length > 0 &&
      guessStatus.every((item) => item.hasBeenGuessed === true)
    ) {
      console.log('You win')
      setIsTimerActive(false)
      setIsGameWon(true)
      setScore()
    }
  }, [guessStatus])

  useEffect(() => {
    const getCharacters = async () => {
      if (guessStatus.length === 0) {
        let characters = await getDocs(locationsRef)

        let status: GuessStatus = []

        characters.docs.map((doc) => {
          status.push({
            character: { ...(doc.data() as CharacterInfo) },
            name: doc.id,
            hasBeenGuessed: false,
          })
        })
        setGuessStatus(status)
      }
    }
    getCharacters()
  }, [])

  return (
    <div>
      <Timer />
      <div className="image-container">
        <img
          src={url}
          onClick={(e) => {
            let bounds = e.currentTarget.getBoundingClientRect()
            let x = e.clientX - bounds.left
            let y = e.clientY - bounds.top
            setGuessArea({ x, y })
          }}
        />
        {guessStatus.map((item) => {
          console.log(item)
          if (item.hasBeenGuessed) {
            return (
              <div
                key={item.name}
                className="correct-guess-marker"
                style={{
                  position: 'absolute',
                  left: `${Number(item.character.x) - 50}px`,
                  top: `${Number(item.character.y) - 50}px`,
                }}
              >
                &#x2713;
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { getDocs, collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { GameStatus, GuessStatus, TimerContext } from './App'
import { db } from '../Firebase'
import '../styles/Main.css'
import { AuthContext } from '../contexts/AuthContext'
import { Timer } from './Timer'
import { Scoreboard } from './Scoreboard'
import { CharacterList } from './CharacterList'
import Draggable from 'react-draggable'

type ImageContainerProps = {
  url: string
  title: string
  gamemode: number
}

export type GuessArea = {
  x: Number
  y: Number
}

type CharacterInfo = {
  height: Number
  width: Number
  x: Number
  y: Number
}

export const ImageContainer = ({
  url,
  title,
  gamemode,
}: ImageContainerProps) => {
  let [guessArea, setGuessArea] = useState<GuessArea>({ x: 0, y: 0 })
  let [isGuessSelectorActive, setIsGuessSelectorActive] = useState(false)

  let { setIsTimerActive, timerSeconds } = useContext(TimerContext)
  let { user } = useContext(AuthContext)
  let { setIsGameWon } = useContext(GameStatus)
  let { guessStatus, setGuessStatus } = useContext(GuessStatus)

  const locationsRef = collection(
    db,
    `art/${title}/${gamemode}/data/characterLocations`
  )
  const scoresRef = collection(db, `art/${title}/${gamemode}/data/scores`)

  let checkGuess = async ({ x, y }: GuessArea, characterGuess: string) => {
    let characterLocations = await getDocs(locationsRef)

    characterLocations.docs.map(async (doc) => {
      let characterData = doc.data()

      if (
        x < characterData.x + characterData.width &&
        x > characterData.x - characterData.width &&
        y < characterData.y + characterData.height &&
        y > characterData.y - characterData.height &&
        characterData.name === characterGuess
      ) {
        console.log('correct guess')

        let updatedGuessStatus = [...guessStatus]
        let index = updatedGuessStatus.findIndex((item) => item.name === doc.id)
        updatedGuessStatus[index].hasBeenGuessed = true

        setGuessStatus(updatedGuessStatus)
      } else {
        console.log('incorrect guess')
      }
    })
  }

  useEffect(() => {
    console.log(guessArea)
  }, [guessArea])

  useEffect(() => {
    let setScore = async () => {
      if (user) {
        let uid = user.uid
        let scores = await getDocs(scoresRef)
        let update = true

        scores.docs.map((item) => {
          let data = item.data()
          if (user?.displayName === data.name && data.time < timerSeconds) {
            update = false
          }
        })

        if (update) {
          await setDoc(
            doc(db, `art/${title}/${gamemode}/data/scores`, uid),
            { name: String(user.displayName), time: timerSeconds },
            { merge: true }
          )
        }
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
      <Draggable axis="x" bounds="parent">
        <div className="timer-character-list-container">
          <Timer />
          <CharacterList url={url} characterList={guessStatus} />
        </div>
      </Draggable>

      <div className="image-container">
        <div className="image-container-interior">
          <img
            id="main-picture"
            draggable="false"
            src={url}
            onClick={(e) => {
              setIsGuessSelectorActive(true)
              let bounds = e.currentTarget.getBoundingClientRect()
              let x = e.clientX - bounds.left
              let y = e.clientY - bounds.top
              setGuessArea({ x, y })
            }}
          />
          {guessStatus.map((item) => {
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
          <div
            className="guess-character-selector"
            style={{
              zIndex: '10600',
              position: 'absolute',
              visibility: `${
                isGuessSelectorActive === true ? 'visible' : 'hidden'
              }`,
              left: `${guessArea?.x}px`,
              top: `${guessArea?.y}px`,
            }}
            onClick={() => {
              setIsGuessSelectorActive(!isGuessSelectorActive)
            }}
          >
            {guessStatus.map((item) => {
              return (
                <div
                  key={item.name}
                  onClick={() => {
                    checkGuess(guessArea, item.name)
                  }}
                >
                  {item.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { getDocs, collection, doc } from 'firebase/firestore'
import { db } from '../Firebase'
import '../styles/Main.css'

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
  let [guessStatus, setGuessStatus] = useState<GuessStatus>([])

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
    if (guessStatus.every((item) => item.hasBeenGuessed === true)) {
      console.log('You win')
    }
  }, [guessStatus])

  useEffect(() => {
    const getCharacters = async () => {
      let characters = await getDocs(locationsRef)

      let status: GuessStatus = []

      characters.docs.map((doc) => {
        status.push({
          character: { ...(doc.data() as CharacterInfo) },
          name: doc.id,
          hasBeenGuessed: false,
        })
        console.log(status)
      })
      setGuessStatus(status)
    }
    getCharacters()
    console.log(guessStatus)
  }, [])

  return (
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
  )
}

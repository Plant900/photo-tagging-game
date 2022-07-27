import React, { useEffect, useState } from 'react'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../Firebase'
import '../styles/Main.css'

type ImageContainerProps = {
  url: string
}

type GuessArea = {
  x: Number
  y: Number
}

type GuessStatus = {
  name: string
  hasBeenGuessed: boolean
}[]

export const ImageContainer = ({ url }: ImageContainerProps) => {
  let [guessArea, setGuessArea] = useState<GuessArea>({ x: 0, y: 0 })
  let [guessStatus, setGuessStatus] = useState<GuessStatus>([])

  const locationsRef = collection(db, 'characterLocations')

  let jabbaArea = { x: 1205, y: 3799, width: 76, height: 100 }

  // takes coordinates and checks with database
  // info in database will be like correctGuess below
  let checkGuess = async ({ x, y }: GuessArea) => {
    let characterLocations = await getDocs(locationsRef)
    characterLocations.docs.map((doc) => {
      let characterData = doc.data()
    })

    // if (
    //   x < correctGuess.x + correctGuess.width &&
    //   x > correctGuess.x - correctGuess.width &&
    //   y < correctGuess.y + correctGuess.height &&
    //   y > correctGuess.y - correctGuess.height
    // ) {
    //   console.log('Within bounds')
    // } else {
    //   console.log('Out of bounds')
    // }
  }

  useEffect(() => {
    console.log(guessArea)
    checkGuess(guessArea)
  }, [guessArea])

  useEffect(() => {
    const getCharacters = async () => {
      let characters = await getDocs(locationsRef)
      let status: GuessStatus = []
      characters.docs.map((doc) => {
        status.push({ name: doc.id, hasBeenGuessed: false })
      })
      setGuessStatus(status)
    }
    getCharacters()
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
        useMap="#image-map"
      />
    </div>
  )
}

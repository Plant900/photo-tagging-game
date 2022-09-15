import React, { useEffect, useState } from 'react'
import { GuessArea } from './ImageContainer'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { LevelCreatorCharacterList } from './LevelCreatorCharacterList'
import '../styles/LevelCreator.css'
import { setDoc, doc, collection, writeBatch } from 'firebase/firestore'
import { db } from '../Firebase'

const storage = getStorage()

type CharacterInfo = {
  name: string
  x: Number
  y: Number
}

export type LevelInfo = {
  levelName: string
  url: string
  characterList: CharacterInfo[]
}

export const LevelCreator = () => {
  const [selectedImage, setSelectedImage] = useState<File | undefined>()
  const [guessArea, setGuessArea] = useState<GuessArea>({ x: 0, y: 0 })
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    levelName: '',
    url: '',
    characterList: [],
  })
  const [characterInfo, setCharacterInfo] = useState<CharacterInfo>({
    name: '',
    x: 0,
    y: 0,
  })

  const imagesRef = ref(storage, `images/${levelInfo.levelName}`)

  let uploadLevel = async () => {
    if (selectedImage && levelInfo.characterList.length > 1) {
      uploadBytes(imagesRef, selectedImage).then((snapshot) => {
        console.log('Image uploaded to database')
      })

      const batch = writeBatch(db)

      batch.set(doc(db, `art/${levelInfo.levelName}/scores/init`), {
        name: 'init',
        time: 10000,
      })

      batch.set(doc(db, `art/${levelInfo.levelName}`), {
        url: levelInfo.url,
        levelName: levelInfo.levelName,
        imageName: levelInfo.levelName,
      })

      levelInfo.characterList.forEach((character) => {
        batch.set(
          doc(
            db,
            `art/${levelInfo.levelName}/characterLocations/${character.name}`
          ),
          {
            height: 50,
            width: 50,
            name: character.name,
            x: character.x,
            y: character.y,
          }
        )
      })

      await batch.commit()
    }
  }

  useEffect(() => {
    console.log(guessArea)
    setCharacterInfo({ ...characterInfo, x: guessArea.x, y: guessArea.y })
  }, [guessArea])

  return (
    <div className="level-creator-container">
      <div>Upload image</div>
      <input
        className="level-creator-upload-image"
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            setSelectedImage(e.target.files[0])

            let thing = URL.createObjectURL(e.target.files[0])

            let newLevelInfo = { ...levelInfo, url: thing }
            setLevelInfo(newLevelInfo)
          }

          console.log(selectedImage)
        }}
      />
      <div className="img-container">
        <img
          src={levelInfo.url}
          onClick={(e) => {
            let bounds = e.currentTarget.getBoundingClientRect()
            let x = e.clientX - bounds.left
            let y = e.clientY - bounds.top
            setGuessArea({ x, y })
          }}
        />
        {selectedImage ? (
          <div
            className="guess-area-marker"
            style={{
              zIndex: '10600',
              position: 'absolute',
              left: `${Number(guessArea?.x) - 50}px`,
              top: `${Number(guessArea?.y) - 50}px`,
            }}
          >
            ✖
          </div>
        ) : (
          ''
        )}
      </div>

      <div className="coords-container">
        <div>{`x: ${guessArea?.x}, y: ${guessArea?.y}`}</div>
        <input
          type="text"
          placeholder="Location/character name"
          onChange={(e) => {
            setCharacterInfo({ ...characterInfo, name: e.target.value })
          }}
        />

        <button
          onClick={() => {
            if (selectedImage && guessArea && characterInfo.name.length > 0) {
              setCharacterInfo({ ...characterInfo, name: characterInfo.name })

              let newLevelInfo = { ...levelInfo }
              newLevelInfo.characterList?.push(characterInfo)
              setLevelInfo(newLevelInfo)
            }
          }}
        >
          Add location
        </button>

        <input
          type="text"
          placeholder="Level Name"
          onChange={(e) => {
            setLevelInfo({ ...levelInfo, levelName: e.target.value })
          }}
        />

        <button
          onClick={() => {
            uploadLevel()
          }}
        >
          Submit level
        </button>
        {levelInfo ? (
          <LevelCreatorCharacterList
            levelInfo={levelInfo}
            setLevelInfo={setLevelInfo}
          />
        ) : (
          <div>Define at least one location</div>
        )}
      </div>
    </div>
  )
}

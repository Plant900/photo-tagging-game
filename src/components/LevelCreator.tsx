import React, { useEffect, useState } from 'react'
import { GuessArea } from './ImageContainer'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { LevelCreatorCharacterList } from './LevelCreatorCharacterList'
import '../styles/LevelCreator.css'
import { setDoc, doc, collection, writeBatch } from 'firebase/firestore'
import { db } from '../Firebase'

const storage = getStorage()

type CharacterSet = {
  characters: CharacterInfo[]
}

type CharacterInfo = {
  name: string
  x: Number
  y: Number
}

export type LevelInfo = {
  levelName: string
  url: string
  characterSets: CharacterInfo[][]
}

export const LevelCreator = () => {
  const [selectedImage, setSelectedImage] = useState<File | undefined>()
  const [currentCharacterSet, setCurrentCharacterSet] = useState<number>(0)
  const [guessArea, setGuessArea] = useState<GuessArea>({ x: 0, y: 0 })
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    levelName: '',
    url: '',
    characterSets: [[]],
  })
  const [characterInfo, setCharacterInfo] = useState<CharacterInfo>({
    name: '',
    x: 0,
    y: 0,
  })

  const imagesRef = ref(storage, `images/${levelInfo.levelName}`)

  let addCharacterSet = (number: number) => {
    if (levelInfo.characterSets[number]) {
      setCurrentCharacterSet(number)
      return
    }

    let newCharacterSets = [...levelInfo.characterSets]
    newCharacterSets[number] = []

    setLevelInfo({ ...levelInfo, characterSets: newCharacterSets })
    console.log('that index doesnt exist, but it should now.')
    setCurrentCharacterSet(number)
  }

  let uploadLevel = async () => {
    if (selectedImage && levelInfo.characterSets[0].length > 0) {
      uploadBytes(imagesRef, selectedImage).then((snapshot) => {
        console.log('Image uploaded to database')
      })

      const batch = writeBatch(db)

      batch.set(doc(db, `art/${levelInfo.levelName}`), {
        url: levelInfo.url,
        numberOfGamemodes: levelInfo.characterSets.length,
        levelName: levelInfo.levelName,
        imageName: levelInfo.levelName,
      })

      for (let i = 0; i < levelInfo.characterSets.length; i++) {
        batch.set(doc(db, `art/${levelInfo.levelName}/${i}/data/scores/init`), {
          name: 'init',
          time: 10000,
        })
      }

      for (let i = 0; i < levelInfo.characterSets.length; i++) {
        levelInfo.characterSets[i].forEach((character) => {
          batch.set(
            doc(
              db,
              `art/${levelInfo.levelName}/${i}/data/characterLocations/${character.name}`
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
      }

      console.log('submitting')
      await batch.commit()
    }
  }

  useEffect(() => {
    console.log(guessArea)
    setCharacterInfo({ ...characterInfo, x: guessArea.x, y: guessArea.y })
  }, [guessArea])

  return (
    <div className="level-creator-container">
      <div className="level-creator-upload-container">
        Upload image
        <input
          className="level-creator-upload-image"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (
              e.target.files &&
              e.target.files[0].name.match(/.(jpg|jpeg|png)$/i)
            ) {
              setSelectedImage(e.target.files[0])

              let thing = URL.createObjectURL(e.target.files[0])

              let newLevelInfo = { ...levelInfo, url: thing }
              setLevelInfo(newLevelInfo)
            } else if (
              e.target.files &&
              !e.target.files[0].name.match(/.(jpg|jpeg|png)$/i)
            ) {
              alert('File must be an image of type .jpg, .jpeg, or .png')
            }

            console.log(selectedImage)
          }}
        />
      </div>

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
        <div>{`x: ${guessArea?.x.toFixed(0)}, y: ${guessArea?.y.toFixed(
          0
        )}`}</div>
        <div className="coords-container-tooltip">
          &#9432;
          <span className="coords-container-tooltiptext">
            You may create multiple 'gamemodes' for your level using the Set
            buttons. When a player views your level on the main menu, they will
            be able to choose between sets. Your level may have a maximum of 3
            sets. Switch between them to see which characters or locations will
            be present for each set.
          </span>
        </div>

        <button
          onClick={() => {
            addCharacterSet(0)
          }}
        >
          Set 1
        </button>
        <button
          onClick={() => {
            addCharacterSet(1)
          }}
        >
          Set 2
        </button>
        {levelInfo.characterSets[0].length > 0 &&
        levelInfo.characterSets[1]?.length > 0 ? (
          <button
            onClick={() => {
              addCharacterSet(2)
            }}
          >
            Set 3
          </button>
        ) : (
          ''
        )}

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
              newLevelInfo.characterSets[currentCharacterSet].push(
                characterInfo
              )
              setLevelInfo(newLevelInfo)
              console.log(levelInfo)
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
            levelInfo={{ ...levelInfo }}
            currentCharacterSet={currentCharacterSet}
            setLevelInfo={setLevelInfo}
          />
        ) : (
          <div>Define at least one location</div>
        )}
      </div>
    </div>
  )
}

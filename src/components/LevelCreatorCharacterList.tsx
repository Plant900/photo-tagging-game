import React from 'react'
import { LevelInfo } from './LevelCreator'
import styles from '../styles/CharacterList.module.css'

type LevelCreatorCharacterListProps = {
  levelInfo: LevelInfo
  currentCharacterSet: number
  setLevelInfo: React.Dispatch<React.SetStateAction<LevelInfo>>
}

export const LevelCreatorCharacterList = ({
  levelInfo,
  currentCharacterSet,
  setLevelInfo,
}: LevelCreatorCharacterListProps) => {
  let { url } = levelInfo

  return (
    <div>
      {levelInfo.characterSets &&
      levelInfo.characterSets[currentCharacterSet].length > 0 ? (
        levelInfo.characterSets[currentCharacterSet].map((item) => {
          return (
            <div className={styles.container} key={item.name}>
              <div className={styles.imgContainer}>
                <img
                  src={url}
                  style={{
                    left: `${-Number(item.x) + 50}px`,
                    top: `${-Number(item.y) + 50}px`,
                  }}
                />
              </div>
              <div>{item.name}</div>
              <button
                onClick={() => {
                  let newCharacterList =
                    levelInfo.characterSets[currentCharacterSet]
                  let index = newCharacterList.findIndex((character) => {
                    return (
                      character.name === item.name && character.x === item.x
                    )
                  })
                  newCharacterList.splice(index, 1)

                  let newCharacterSets = [...levelInfo.characterSets]
                  newCharacterSets[currentCharacterSet] = newCharacterList
                  //big problem here
                  setLevelInfo({
                    ...levelInfo,
                    characterSets: [...newCharacterSets],
                  })
                }}
              >
                Remove
              </button>
            </div>
          )
        })
      ) : (
        <div></div>
      )}{' '}
    </div>
  )
}

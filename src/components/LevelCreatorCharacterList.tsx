import { url } from 'inspector'
import React from 'react'
import { CharacterList } from './CharacterList'
import { LevelInfo } from './LevelCreator'

type LevelCreatorCharacterListProps = {
  levelInfo: LevelInfo
  setLevelInfo: React.Dispatch<React.SetStateAction<LevelInfo>>
}

export const LevelCreatorCharacterList = ({
  levelInfo,
  setLevelInfo,
}: LevelCreatorCharacterListProps) => {
  let { url } = levelInfo

  return (
    <div>
      {levelInfo.characterList && levelInfo.characterList.length > 0 ? (
        levelInfo.characterList.map((item) => {
          return (
            <div className="character-list-container">
              <div className="character-list-img-container">
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
                  let newCharacterList = levelInfo.characterList
                  let index = newCharacterList.findIndex((character) => {
                    return (
                      character.name === item.name && character.x === item.x
                    )
                  })
                  newCharacterList.splice(index, 1)
                  setLevelInfo({
                    ...levelInfo,
                    characterList: newCharacterList,
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

import React from 'react'
import '../styles/CharacterList.css'
import { GuessStatus } from './App'
import { LevelInfo } from './LevelCreator'

type CharacterListProps = {
  url: string
  characterList: GuessStatus
}

export const CharacterList = ({ url, characterList }: CharacterListProps) => {
  return (
    <div>
      <span className="character-list-arrows">&#x2190;&#x2192;</span>
      {characterList.length > 0 ? (
        characterList.map((item) => {
          return (
            <div className="character-list-img-container" key={item.name}>
              {item.hasBeenGuessed ? <div className="checkmark">✓</div> : ''}
              <img
                className="character-list-img"
                draggable="false"
                src={url}
                style={{
                  left: `${-Number(item.character.x) + 50}px`,
                  top: `${-Number(item.character.y) + 50}px`,
                }}
              />
            </div>
          )
        })
      ) : (
        <div></div>
      )}
    </div>
  )
}

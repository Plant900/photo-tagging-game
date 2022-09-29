import React from 'react'
import styles from '../styles/CharacterList.module.css'
import { GuessStatus } from './App'
import { LevelInfo } from './LevelCreator'

type CharacterListProps = {
  url: string
  characterList: GuessStatus
}

export const CharacterList = ({ url, characterList }: CharacterListProps) => {
  return (
    <div>
      <span className={styles.arrows}>&#x2190;&#x2192;</span>
      {characterList.length > 0 ? (
        characterList.map((item) => {
          return (
            <div className={styles.imgContainer} key={item.name}>
              {item.hasBeenGuessed ? (
                <div className={styles.checkmark}>✓</div>
              ) : (
                ''
              )}
              <img
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

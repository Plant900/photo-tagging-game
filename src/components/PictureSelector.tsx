import { collection, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import React, { useEffect, useState, useContext } from 'react'
import styles from '../styles/PictureSelector.module.css'
import { AuthContext } from '../contexts/AuthContext'

type PictureSelectorProps = {
  setPictureSelection: React.Dispatch<
    React.SetStateAction<{
      url: string
      title: string
      levelID: string
      gamemode: number
    } | null>
  >
}

type LevelList = {
  levelName: string
  numberOfGamemodes?: number[]
  levelID: string
  uploadedBy: string
  url?: string
}[]

export const PictureSelector = ({
  setPictureSelection,
}: PictureSelectorProps) => {
  let { user } = useContext(AuthContext)

  const [levelList, setLevelList] = useState<LevelList>([])

  const storage = getStorage()
  const levelsRef = collection(db, 'art')

  let getLevels = async () => {
    let getLevelNameInfo = async () => {
      let newLevelList: LevelList = []

      let levels = await getDocs(levelsRef)

      levels.forEach((level) => {
        let data = level.data()

        newLevelList.push({
          levelName: data.levelName,
          numberOfGamemodes: data.numberOfGamemodes,
          levelID: data.levelID,
          uploadedBy: data.uploadedBy,
        })
      })

      return newLevelList
    }
    let levelNameInfo = await getLevelNameInfo()

    let getLevelImageInfo = async () => {
      let newLevelList = []

      for (const level of levelNameInfo) {
        let downloadURL = await getDownloadURL(
          ref(storage, `images/${level.levelID}`)
        )
        newLevelList.push({
          levelName: level.levelName,
          levelID: level.levelID,
          numberOfGamemodes: level.numberOfGamemodes,
          uploadedBy: level.uploadedBy,
          url: downloadURL,
        })
      }
      return newLevelList
    }

    let finalResult = await getLevelImageInfo()
    setLevelList(finalResult)
  }

  useEffect(() => {
    getLevels()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.message}>First, choose a level</div>
      {levelList?.map((level) => {
        return (
          <div className={styles.imgContainer} key={level.levelName}>
            <img
              src={level.url}
              title={level.levelName}
              onClick={(e) => {
                setPictureSelection({
                  url: (e.target as HTMLInputElement).src,
                  title: (e.target as HTMLInputElement).title,
                  levelID: level.levelID,
                  gamemode: 0,
                })
              }}
            />
            <div className={styles.gamemodesContainer}>
              <div className={styles.gamemodesMessage}>{level.levelName}</div>
              <div className={styles.gamemodes}>
                {level.numberOfGamemodes?.map((mode) => (
                  <div
                    className={styles.gamemode}
                    key={mode}
                    onClick={() => {
                      level.url
                        ? setPictureSelection({
                            url: level.url,
                            title: level.levelName,
                            levelID: level.levelID,
                            gamemode: mode,
                          })
                        : console.log('no url')
                    }}
                  >
                    {mode + 1}
                  </div>
                ))}
              </div>
            </div>
            {user?.email === level.uploadedBy ? (
              <div className={`${styles.userLevelMsg} ${styles.levelMsg}`}>
                Your level
              </div>
            ) : (
              // <div className={styles.levelMsg}>{level.uploadedBy}</div>
              ''
            )}
          </div>
        )
      })}
    </div>
  )
}

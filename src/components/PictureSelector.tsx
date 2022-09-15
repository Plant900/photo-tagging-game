import { collection, getDocs } from 'firebase/firestore'
import { db } from '../Firebase'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import '../styles/PictureSelector.css'

type PictureSelectorProps = {
  setPictureSelection: React.Dispatch<
    React.SetStateAction<{ url: string; title: string } | null>
  >
}

type LevelList = {
  levelName: string
  imageName: string
  url?: string
}[]

export const PictureSelector = ({
  setPictureSelection,
}: PictureSelectorProps) => {
  const [levelList, setLevelList] = useState<LevelList>([])

  const storage = getStorage()
  const levelsRef = collection(db, 'art')
  const imagesRef = ref(storage, 'images')

  let getLevels = async () => {
    let getLevelNameInfo = async () => {
      let newLevelList: {
        levelName: string
        imageName: string
        url?: string
      }[] = []

      let levels = await getDocs(levelsRef)

      levels.forEach((level) => {
        let data = level.data()
        newLevelList.push({
          levelName: data.levelName,
          imageName: data.imageName,
        })
      })

      return newLevelList
    }
    let levelNameInfo = await getLevelNameInfo()

    let getLevelImageInfo = async () => {
      let newLevelList = []

      for (const level of levelNameInfo) {
        let downloadURL = await getDownloadURL(
          ref(storage, `images/${level.imageName}`)
        )
        newLevelList.push({
          levelName: level.levelName,
          imageName: level.imageName,
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
    <div className="picture-selector-container">
      <div className="picture-selector-message">First, choose a picture</div>
      {levelList?.map((level) => {
        return (
          <div className="picture-selector-img-container" key={level.levelName}>
            <img
              src={level.url}
              title={level.levelName}
              onClick={(e) => {
                setPictureSelection({
                  url: (e.target as HTMLInputElement).src,
                  title: (e.target as HTMLInputElement).title,
                })
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

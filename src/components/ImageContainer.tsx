import React, { useEffect, useState } from 'react'
import { Gameboard } from './Gameboard'
import '../styles/Main.css'

type ImageContainerProps = {
  url: string
}

type ImageSizeInfo = {
  width: Number
  height: Number
}

export const ImageContainer = ({ url }: ImageContainerProps) => {
  let [imageSize, setImageSize] = useState<ImageSizeInfo | null>()

  useEffect(() => {
    let image = document.getElementById('image-1') as HTMLImageElement
    setImageSize({ width: image.naturalWidth, height: image.naturalHeight })
    console.log(imageSize)
  }, [])

  return (
    <div className="image-container">
      <img
        className="image-1"
        id="image-1"
        src={
          'https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497'
        }
      />
      <Gameboard height={25} width={25} />
    </div>
  )
}

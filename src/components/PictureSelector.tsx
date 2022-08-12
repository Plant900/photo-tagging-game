import React from 'react'
import '../styles/PictureSelector.css'

type PictureSelectorProps = {
  setPictureSelection: React.Dispatch<React.SetStateAction<string | null>>
}

export const PictureSelector = ({
  setPictureSelection,
}: PictureSelectorProps) => {
  return (
    <div className="picture-selector-container">
      <div
        className="picture-selector-img-container"
        onClick={(e) => {
          setPictureSelection((e.target as HTMLInputElement).src)
        }}
      >
        <img src="https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497" />
      </div>
      <div
        className="picture-selector-img-container"
        onClick={(e) => {
          setPictureSelection((e.target as HTMLInputElement).src)
        }}
      >
        <img src="https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497" />
      </div>
      <div
        className="picture-selector-img-container"
        onClick={(e) => {
          setPictureSelection((e.target as HTMLInputElement).src)
        }}
      >
        <img src="https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497" />
      </div>
    </div>
  )
}

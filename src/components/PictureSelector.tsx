import React from 'react'
import '../styles/PictureSelector.css'

type PictureSelectorProps = {
  setPictureSelection: React.Dispatch<
    React.SetStateAction<{ url: string; title: string } | null>
  >
}

export const PictureSelector = ({
  setPictureSelection,
}: PictureSelectorProps) => {
  return (
    <div className="picture-selector-container">
      <div className="picture-selector-message">First, choose a picture</div>
      <div className="picture-selector-img-container">
        <img
          src="https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497"
          title="egor-klyuchnyk-AD2022"
          onClick={(e) => {
            setPictureSelection({
              url: (e.target as HTMLInputElement).src,
              title: (e.target as HTMLInputElement).title,
            })
          }}
        />
      </div>
      <div className="picture-selector-img-container">
        <img
          src="https://dcassetcdn.com/design_img/2065112/127172/127172_11001040_2065112_cb56bdd1_image.jpg"
          title="toys-room"
          onClick={(e) => {
            setPictureSelection({
              url: (e.target as HTMLInputElement).src,
              title: (e.target as HTMLInputElement).title,
            })
          }}
        />
      </div>
      <div className="picture-selector-img-container">
        <img
          src="https://r4.wallpaperflare.com/wallpaper/489/218/502/waldo-puzzles-where-s-wally-wallpaper-49e038adb12afdaba667184f60e1c6cd.jpg"
          title="waldo-sports-meet"
          onClick={(e) => {
            setPictureSelection({
              url: (e.target as HTMLInputElement).src,
              title: (e.target as HTMLInputElement).title,
            })
          }}
        />
      </div>
    </div>
  )
}

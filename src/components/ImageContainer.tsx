import React, { SyntheticEvent, useEffect, useState, useRef } from 'react'
import { Gameboard } from './Gameboard'
import '../styles/Main.css'

type ImageContainerProps = {
  url: string
}

type GuessArea = {
  x: Number
  y: Number
}

export const ImageContainer = ({ url }: ImageContainerProps) => {
  let [guessArea, setGuessArea] = useState<GuessArea>({ x: 0, y: 0 })

  // takes coordinates and checks with database?
  let checkGuess = () => {}

  return (
    <div className="image-container">
      <img
        src={url}
        onClick={(e) => {
          let bounds = e.currentTarget.getBoundingClientRect()
          let x = e.clientX - bounds.left
          let y = e.clientY - bounds.top
          setGuessArea({ x, y })
        }}
        useMap="#image-map"
      />
      <map name="image-map">
        <area shape="circle" coords={`${guessArea.x},${guessArea.y}, 30`} />
      </map>
    </div>
  )
}

// type ImageSizeInfo = {
//   width: Number
//   height: Number
// }

// export const ImageContainer = ({ url }: ImageContainerProps) => {
//   let imgEl = useRef<HTMLImageElement>(null)
//   let [imageSize, setImageSize] = useState<ImageSizeInfo>()
//   let [numberOfSquares, setNumberOfSquares] = useState<Number | null>(null)

//   let determineSquareCount = (size: ImageSizeInfo | undefined) => {
//     if (size) {
//       let rows = size.width.valueOf() / 40
//       let columns = size.height.valueOf() / 40
//       let number = Math.floor(rows * columns)
//       setNumberOfSquares(number + 10)
//     }
//   }

//   let onImageLoad = (info: any) => {
//     let imageSize = { width: info.naturalWidth, height: info.naturalHeight }
//     setImageSize(imageSize)
//     determineSquareCount(imageSize)
//     console.log(imageSize)
//   }

//   useEffect(() => {
//     const imgElCurrent = imgEl.current

//     if (imgElCurrent) {
//       imgElCurrent.addEventListener('load', () => onImageLoad(imgElCurrent))
//       return () =>
//         imgElCurrent.removeEventListener('load', () =>
//           onImageLoad(imgElCurrent)
//         )
//     }
//   }, [imgEl])

//   return (
//     <div className="image-container">
//       <img
//         className="image-1"
//         id="image-1"
//         src={
//           'https://cdna.artstation.com/p/assets/images/images/034/427/268/large/egor-klyuchnyk-x-2-seasons-bt.jpg?1612271497'
//         }
//         ref={imgEl}
//       />
//       <Gameboard numberOfSquares={numberOfSquares} />
//     </div>
//   )
// }

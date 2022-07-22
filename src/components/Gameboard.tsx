import React, { useEffect, useState } from 'react'
import '../styles/Main.css'

type GameboardProps = {
  numberOfSquares: Number | null
}

export const Gameboard = ({ numberOfSquares }: GameboardProps) => {
  let [coordArray, setCoordArray] = useState<Number[] | null>([])

  function createCoordArray({ numberOfSquares }: GameboardProps) {
    let newArray = []
    if (!numberOfSquares) {
      return
    }
    for (let i = 0; i < numberOfSquares; i++) {
      newArray.push(i)
    }
    setCoordArray(newArray)
  }

  useEffect(() => {
    createCoordArray({ numberOfSquares })
  })

  return coordArray ? (
    <div className="gameboard-container">
      {coordArray.map((thing) => {
        return (
          <div className={'gameboard-square'} data-square-number={thing}>
            &nbsp;
          </div>
        )
      })}
    </div>
  ) : (
    <div>No Gameboard yet</div>
  )
}

import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import styles from '../styles/UserInfo.module.css'
import { auth } from '../Firebase'

export const UserInfo = () => {
  const { user, logOut } = useContext(AuthContext)

  let [showUserInfo, setShowUserInfo] = useState(false)

  return (
    <div className={styles.mainContainer}>
      {user?.photoURL ? (
        <div className={styles.itemsContainer}>
          <img
            className={styles.profileImg}
            src={user.photoURL}
            onClick={() => {
              user ? console.log(user) : console.log('no user')
              setShowUserInfo((showUserInfo) => !showUserInfo)
            }}
          />
          {showUserInfo ? (
            <ul className={styles.items}>
              <li>My Levels</li>
              <li
                onClick={() => {
                  logOut()
                }}
              >
                Log out
              </li>
            </ul>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

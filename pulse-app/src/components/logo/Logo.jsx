import React from 'react'
import styles from './Logo.module.css'
import {Link} from 'react-router-dom'

const Logo = () => {
  return (
    <>
      <Link to='/' className={styles.logo}>
          Pulse
      </Link>
    </>
  )
}

export default Logo
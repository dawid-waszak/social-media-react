import React from 'react'
import {Link} from 'react-router-dom'

const ButtonLink = (props) => {
  return (
    <Link to={props.route} className='btn'>{props.title}</Link>
  )
}

export default ButtonLink
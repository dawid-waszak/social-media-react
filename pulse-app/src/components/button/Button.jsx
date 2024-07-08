import React from 'react'

const Button = (props) => {
  return (
    <button onClick={() => props.action} className='btn'>
        {props.title}
    </button>
  )
}

export default Button
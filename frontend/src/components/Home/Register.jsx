import React from 'react'

function Register(props) {
  return (
    <div className={`absolute ${props.active ? '' : 'opacity-0 pointer-events-none translate-y-4'} transition-all`}>
      Register
    </div>
  )
}

export default Register
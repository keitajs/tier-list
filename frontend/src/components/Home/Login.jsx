import React from 'react'

function Login(props) {
  return (
    <div className={`absolute ${props.active ? '' : 'opacity-0 pointer-events-none translate-y-4'} transition-all`}>
      Login
    </div>
  )
}

export default Login
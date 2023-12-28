import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div>
      <Link to={'/'}>Főoldal</Link>
      <Link to={'/list'}>Lista</Link>
      <Link to={'/profile'}>Profil</Link>
    </div>
  )
}

export default Header
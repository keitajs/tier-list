import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NavItem(props) {
  const [hover, setHover] = useState(false)

  return (
    <Link to={props.pathname} className='relative flex items-center gap-4 h-12 text-lg' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <FontAwesomeIcon icon={props.icon} className='w-6' />
      <div className={`${props.hover ? '' : 'opacity-0'} transition-opacity`}>{props.text}</div>
      {window.location.pathname === props.pathname ? <div className='absolute -left-4 h-2/3 w-1 rounded-e-lg bg-blue-500'></div> : <div className={`absolute ${hover ? '-left-4' : '-left-6'} h-2/3 w-1 rounded-e-lg bg-white transition-all`}></div>}
    </Link>
  )
}

export default NavItem
import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NavItem(props) {
  const isCurrent = window.location.pathname === props.pathname

  return (
    <Link to={props.pathname} className='group relative w-full flex flex-col items-center justify-center gap-0.5 pt-4 pb-3'>
      <FontAwesomeIcon icon={props.icon} className='h-4' />
      <div className='text-xs'>{props.text}</div>
      <div className={`absolute ${isCurrent ? 'bottom-0' : '-bottom-2 group-hover:bottom-0'} left-1/4 right-1/4 h-1 rounded-t-lg ${isCurrent ? 'bg-blue-500' : 'bg-white'} transition-all`}></div>
    </Link>
  )
}

export default NavItem
import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NavItem(props) {
  return (
    <Link to={props.pathname} className='group/navitem relative flex items-center gap-4 h-12 text-lg'>
      <FontAwesomeIcon icon={props.icon} className='w-6' />
      <div className={`opacity-0 group-hover:opacity-100 transition-opacity`}>{props.text}</div>
      {window.location.pathname === props.pathname ? <div className='absolute -left-4 h-2/3 w-1 rounded-e-lg bg-blue-500'></div> : <div className={`absolute -left-6 group-hover/navitem:-left-4 h-2/3 w-1 rounded-e-lg bg-white transition-all`}></div>}
    </Link>
  )
}

export default NavItem
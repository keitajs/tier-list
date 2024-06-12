import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faGears } from '@fortawesome/free-solid-svg-icons'

function ListNavbar(props) {
  return (
    <div className={`fixed right-5 bottom-5 p-1.5 rounded-2xl bg-neutral-900/85 z-50 hidden sm:inline ${props.selectedList ? 'sm:inline' : 'sm:!hidden'}`}>
      <div className='relative flex rounded-xl bg-neutral-800/50'>
        <div className={`z-0 absolute h-16 w-16 rounded-xl bg-blue-500 ${window.location.pathname === '/list/editor' ? 'left-0' : 'left-16'} transition-all`}></div>
        <Link to={`/list/editor?id=${props.selectedList}`} className={`z-10 flex items-center justify-center h-16 w-16 rounded-xl ${window.location.pathname === '/list/editor' ? '' : 'hover:bg-neutral-800 transition-colors'}`}>
          <FontAwesomeIcon icon={faPen} className='h-6' />
        </Link>
        <Link to={'/list'} className={`z-10 flex items-center justify-center h-16 w-16 rounded-xl ${window.location.pathname === '/list/editor' ? 'hover:bg-neutral-800 transition-colors' : ''}`}>
          <FontAwesomeIcon icon={faGears} className='h-6' />
        </Link>
      </div>
    </div>
  )
}

export default ListNavbar
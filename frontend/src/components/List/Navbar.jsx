import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faGears } from '@fortawesome/free-solid-svg-icons'

function Navbar(props) {
  return (
    <div className='absolute right-5 bottom-5 p-1.5 rounded-2xl bg-neutral-900/85 z-50'>
      <div className='relative flex rounded-xl bg-neutral-800/50'>
        <div className={`z-0 absolute h-16 w-16 rounded-xl bg-blue-500 ${props.editor ? 'left-0' : 'left-16'} transition-all`}></div>
        <button onClick={() => props.setEditor(true)} className={`z-10 flex items-center justify-center h-16 w-16 rounded-xl ${props.editor ? '' : 'hover:bg-neutral-800 transition-colors'}`}>
          <FontAwesomeIcon icon={faPen} className='h-6' />
        </button>
        <button onClick={() => props.setEditor(false)} className={`z-10 flex items-center justify-center h-16 w-16 rounded-xl ${props.editor ? 'hover:bg-neutral-800 transition-colors' : ''}`}>
          <FontAwesomeIcon icon={faGears} className='h-6' />
        </button>
      </div>
    </div>
  )
}

export default Navbar
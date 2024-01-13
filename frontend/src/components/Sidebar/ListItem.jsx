import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire } from '@fortawesome/free-solid-svg-icons'

function ListItem(props) {
  return (
    <button className='flex items-center hover:bg-neutral-800 hover:bg-opacity-50 mx-2 px-2 py-0.5 rounded-md transition-colors'>
      <div className='flex justify-center w-3 mr-3'>{[<FontAwesomeIcon icon={faEllipsis} className='text-white' />, <FontAwesomeIcon icon={faCheck} className='text-emerald-500' />, <FontAwesomeIcon icon={faDumpsterFire} className='text-red-500' />][props.status - 1]}</div>
      {props.name}
    </button>
  )
}

export default ListItem
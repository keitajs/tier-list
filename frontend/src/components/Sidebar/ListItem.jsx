import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire } from '@fortawesome/free-solid-svg-icons'

function ListItem(props) {
  return (
    <button onClick={() => props.history(`/list?id=${props.list.id}`)} className='flex items-center justify-between gap-3 hover:bg-neutral-800 hover:bg-opacity-50 mx-2 px-2 py-0.5 rounded-md transition-colors'>
      <div className='flex items-center justify-center w-4'>{[<FontAwesomeIcon icon={faEllipsis} className='text-white' />, <FontAwesomeIcon icon={faCheck} className='text-emerald-500' />, <FontAwesomeIcon icon={faDumpsterFire} className='text-red-500' />][props.list.status - 1]}</div>
      <div className='mr-auto truncate'>{props.list.name}</div>
      <div className='w-5 h-5 rounded-full overflow-hidden'>
        <img src={`http://localhost:2000/user/images/${props.list.updates[0].user.avatar}`} alt="" className='w-full h-full object-cover' />
      </div>
    </button>
  )
}

export default ListItem
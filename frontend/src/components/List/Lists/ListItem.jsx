import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function ListItem(props) {
  return (
    <button onClick={props.onClick} className='flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-950 even:bg-opacity-70 odd:bg-opacity-85 hover:bg-neutral-950 hover:bg-opacity-40 transition-all'>
      <div className='flex items-center text-xl'>
        <span className='mr-3'>{props.list.name}</span>
        {[<FontAwesomeIcon icon={faEllipsis} className='text-white' />, <FontAwesomeIcon icon={faCheck} className='text-emerald-500' />, <FontAwesomeIcon icon={faDumpsterFire} className='text-red-500' />][props.list.status - 1]}
      </div>
      <div className='flex items-center text-sm'>
        {props.public ? <p>
          <span className='text-blue-500 opacity-75'>Admin</span><span className='opacity-40'> frissítette ekkor: </span><span className='text-blue-500 opacity-75'>2024.01.12.</span>
        </p> : <>
          <span className='opacity-40'>{props.list.private ? 'Private' : 'Public'}</span>
          <FontAwesomeIcon icon={faChevronRight} className={`${props.list.id === props.activeList?.id ? 'ml-2 w-3' : 'ml-0 w-0'} transition-all`} />
        </>}
      </div>
    </button>
  )
}

export default ListItem
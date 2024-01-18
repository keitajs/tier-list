import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faArrowsUpDownLeftRight, faPen, faUserPen, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function PermissionItem(props) {
  return (
    <button onClick={() => props.setActive(active => active?.edit ? null : { edit: true, ...props.permission })} className='flex items-center justify-between px-4 py-3 rounded-xl even:bg-neutral-950/70 odd:bg-neutral-950/85 hover:bg-neutral-950/40 transition-all'>
      <div className='text-xl'>{props.user.username}</div>
      <div className='flex items-center gap-2 text-sm opacity-40'>
        {['Megtekintés', 'Mozgatás', 'Szerkesztés'][props.permission.value - 1]}
        {[<FontAwesomeIcon icon={faEye} />, <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />, <FontAwesomeIcon icon={faPen} />][props.permission.value - 1]}
      </div>
      <div className='flex'>
        <FontAwesomeIcon icon={faUserPen} className='text-emerald-600 hover:text-emerald-500 transition-colors' />
        <FontAwesomeIcon icon={faChevronRight} className={`${props.active?.id === props.permission.id ? 'ml-2.5 w-3' : 'ml-0 w-0'} transition-all`} />
      </div>
    </button>
  )
}

export default PermissionItem
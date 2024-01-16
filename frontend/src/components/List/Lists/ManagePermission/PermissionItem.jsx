import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faArrowsUpDownLeftRight, faPen, faUserPen, faUserMinus } from '@fortawesome/free-solid-svg-icons'

function PermissionItem(props) {
  const removePermission = () => {
    alert('remove')
  }

  return (
    <div className='flex items-center justify-between px-4 py-3 rounded-xl even:bg-neutral-950/70 odd:bg-neutral-950/85 hover:bg-neutral-950/40 transition-all'>
      <div className='text-xl'>{props.user.username}</div>
      <div className='flex items-center gap-2 text-sm opacity-40'>
        {['Megtekintés', 'Mozgatás', 'Szerkesztés'][props.permission - 1]}
        {[<FontAwesomeIcon icon={faEye} />, <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />, <FontAwesomeIcon icon={faPen} />][props.permission - 1]}
      </div>
      <div className='flex gap-3'>
        <button className='group' onClick={() => props.setActive({ edit: true, user: props.user, permission: props.permission })}><FontAwesomeIcon icon={faUserPen} className='text-emerald-600 group-hover:text-emerald-500 transition-colors' /></button>
        <button className='group' onClick={removePermission}><FontAwesomeIcon icon={faUserMinus} className='text-rose-600 group-hover:text-rose-500 transition-colors' /></button>
      </div>
    </div>
  )
}

export default PermissionItem
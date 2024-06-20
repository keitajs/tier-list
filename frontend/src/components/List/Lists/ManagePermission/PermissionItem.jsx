import React from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faArrowsUpDownLeftRight, faPen, faUserPen, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function PermissionItem({ user, active, permission, setActive }) {
  return (
    <button onClick={() => setActive(active => active?.edit ? null : { edit: true, ...permission })} className='flex items-center justify-between gap-2 px-4 py-3 rounded-xl even:bg-neutral-950/70 odd:bg-neutral-950/85 hover:bg-neutral-950/40 transition-all'>
      <div className='flex items-center gap-3 overflow-hidden text-xl'>
        <div className='truncate'>{user.username}</div>
        <div className='w-6 h-6 rounded-full overflow-hidden'>
          <img src={`${axios.defaults.baseURL}/user/images/${user.avatar}`} alt="" className='w-full h-full object-cover' />
        </div>
      </div>
      <div className='hidden sm:flex items-center gap-2 text-sm opacity-40'>
        {['Megtekintés', 'Mozgatás', 'Szerkesztés'][permission.value - 1]}
        <FontAwesomeIcon icon={[faEye, faArrowsUpDownLeftRight, faPen][permission.value - 1]} />
      </div>
      <div className='flex'>
        <FontAwesomeIcon icon={faUserPen} className='text-emerald-600 hover:text-emerald-500 transition-colors' />
        <FontAwesomeIcon icon={faChevronRight} className={`${active?.userId === permission.userId ? 'ml-2.5 w-3' : 'ml-0 w-0'} transition-all`} />
      </div>
    </button>
  )
}

export default PermissionItem
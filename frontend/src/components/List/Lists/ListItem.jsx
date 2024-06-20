import React from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/dist/locale/hu'

function ListItem({ list, activeList, onClick, onDoubleClick }) {
  return (
    <button onClick={onClick} onDoubleClick={onDoubleClick} className={`flex ${list?.updates ? ' flex-col sm:flex-row' : ''} items-center justify-between gap-2 px-4 py-3 rounded-xl even:bg-neutral-950/70 odd:bg-neutral-950/85 hover:bg-neutral-950/40 transition-all`}>
      <div className={`flex items-center text-xl ${list?.updates ? 'w-full mr-0 sm:w-auto sm:mr-8' : 'mr-8'} grow overflow-hidden`}>
        <span className='mr-3 truncate'>{list.name}</span>
        <FontAwesomeIcon icon={[faEllipsis, faCheck, faDumpsterFire][list.status - 1]} className={['text-white', 'text-emerald-500', 'text-red-500'][list.status - 1]} />
      </div>
      <div className={`flex items-center text-sm ${list?.updates ? 'w-full sm:w-auto' : ''}`}>
        {list?.updates ? <div className='flex items-center'>
          <div className='w-5 h-5 rounded-full overflow-hidden mr-2'><img src={`${axios.defaults.baseURL}/user/images/${list.updates[0].user.avatar}`} alt="" className='w-full h-full object-cover' /></div>
          <p className='w-full text-left'>
            <span className='text-blue-500 opacity-75'>{list.updates[0].user.username}</span>
            <span className='opacity-40'> frissítette ekkor: </span>
            <span className='text-blue-500 opacity-75'>{moment(new Date(list.updates[0].date + 'T' + list.updates[0].time + 'Z')).locale('hu').fromNow()}</span>
          </p>
        </div> : <>
          <span className='opacity-40'>{list.private ? 'Privát' : 'Publikus'}</span>
          <FontAwesomeIcon icon={faChevronRight} className={`${list.id === activeList?.id ? 'ml-2 w-3' : 'ml-0 w-0'} transition-all`} />
        </>}
      </div>
    </button>
  )
}

export default ListItem
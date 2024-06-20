import React from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/dist/locale/hu'

export default function ListItem({ list, activeList, onClick, onDoubleClick }) {
  return (
    <button onClick={onClick} onDoubleClick={onDoubleClick} className={`group flex ${list?.updates ? ' flex-col sm:flex-row' : ''} items-center justify-between gap-2 px-4 py-3 rounded-xl even:bg-neutral-950/40 odd:bg-neutral-950/50 hover:bg-neutral-950/20 transition-all`}>
      <div className={`flex items-center text-xl ${list?.updates ? 'w-full mr-0 sm:w-auto sm:mr-8' : 'mr-8'} grow overflow-hidden`}>
        <span className='mr-4 truncate'>{list.name}</span>

        <div className={'flex items-center rounded-xl text-xs text-white group-even:bg-neutral-800/65 group-odd:bg-neutral-800/75 overflow-hidden'}>
          <div className={' px-2.5 py-1 rounded-xl ' + ['bg-blue-500', 'bg-emerald-500', 'bg-red-500'][list.status - 1]}>
            {['Folyamatban', 'Kész', 'Dobott'][list.status - 1]}
          </div>
          <FontAwesomeIcon icon={[faEllipsis, faCheck, faDumpsterFire][list.status - 1]} className={'h-3.5 px-2 ' + ['text-blue-500', 'text-emerald-500', 'text-red-500'][list.status - 1]} />
        </div>
      </div>
      <div className={`flex items-center justify-end text-sm ${list?.updates ? 'w-0 grow sm:w-auto' : ''}`}>
        {list?.updates ?
          <div className='flex items-center'>
            <div className='w-5 h-5 rounded-full overflow-hidden mr-2'>
              <img src={`${axios.defaults.baseURL}/user/images/${list.updates[0].user.avatar}`} alt="" className='w-full h-full object-cover' />
            </div>
            <p className='w-full text-left'>
              <span className='text-blue-500 opacity-75'>{list.updates[0].user.username}</span>
              <span className='opacity-40'> frissítette </span>
              <span className='text-blue-500 opacity-75'>{moment(new Date(list.updates[0].date + 'T' + list.updates[0].time + 'Z')).locale('hu').fromNow()}</span>
            </p>
          </div>
        :
          <>
            <span className='opacity-40'>{list.private ? 'Privát' : 'Publikus'}</span>
            <FontAwesomeIcon icon={faChevronRight} className={`${list.id === activeList?.id ? 'ml-2 w-3' : 'ml-0 w-0'} transition-all`} />
          </>
        }
      </div>
    </button>
  )
}
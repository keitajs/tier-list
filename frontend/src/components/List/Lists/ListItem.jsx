import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/dist/locale/hu'

function ListItem(props) {
  return (
    <button onClick={props.onClick} onDoubleClick={props.onDoubleClick} className={`flex ${props.list?.updates ? ' flex-col sm:flex-row' : ''} items-center justify-between gap-2 px-4 py-3 rounded-xl even:bg-neutral-950/70 odd:bg-neutral-950/85 hover:bg-neutral-950/40 transition-all`}>
      <div className={`flex items-center text-xl ${props.list?.updates ? 'w-full mr-0 sm:w-auto sm:mr-8' : 'mr-8'} grow overflow-hidden`}>
        <span className='mr-3 truncate'>{props.list.name}</span>
        <FontAwesomeIcon icon={[faEllipsis, faCheck, faDumpsterFire][props.list.status - 1]} className={['text-white', 'text-emerald-500', 'text-red-500'][props.list.status - 1]} />
      </div>
      <div className={`flex items-center text-sm ${props.list?.updates ? 'w-full sm:w-auto' : ''}`}>
        {props.list?.updates ? <div className='flex items-center'>
          <div className='w-5 h-5 rounded-full overflow-hidden mr-2'><img src={`http://localhost:2000/user/images/${props.list.updates[0].user.avatar}`} alt="" className='w-full h-full object-cover' /></div>
          <p className='w-full text-left'>
            <span className='text-blue-500 opacity-75'>{props.list.updates[0].user.username}</span>
            <span className='opacity-40'> frissítette ekkor: </span>
            <span className='text-blue-500 opacity-75'>{moment(new Date(props.list.updates[0].date + 'T' + props.list.updates[0].time + 'Z')).locale('hu').fromNow()}</span>
          </p>
        </div> : <>
          <span className='opacity-40'>{props.list.private ? 'Privát' : 'Publikus'}</span>
          <FontAwesomeIcon icon={faChevronRight} className={`${props.list.id === props.activeList?.id ? 'ml-2 w-3' : 'ml-0 w-0'} transition-all`} />
        </>}
      </div>
    </button>
  )
}

export default ListItem
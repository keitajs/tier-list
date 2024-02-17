import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

function Lists(props) {
  return (
    <div className='p-5 rounded-3xl bg-neutral-900/85'>
      <div className='flex items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>Legtöbbet módosított listák</div>
      {props?.lists.length > 0 ?
        <div className='flex flex-col gap-2.5 mt-3 items-center justify-center'>
          {props.lists.map(list =>
            <Link key={list.id} to={`/list?id=${list.id}`} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl even:bg-neutral-950/70 odd:bg-neutral-950/85 hover:bg-neutral-950/40 transition-all ${props.params && list.private ? 'pointer-events-none' : ''}`}>
              <div className='flex items-center gap-3 text-xl'>
                {list.name}
                {list.private ? <FontAwesomeIcon icon={faLock} className='opacity-25 h-4 w-4' /> : <></>}
              </div>
              <div className='flex items-center text-sm'><p><span className='text-blue-500 opacity-75'>{list.totalUpdates}</span><span className='opacity-40'> módosítás</span></p></div>
            </Link>
          )}
        </div>
      : <div className='flex items-center justify-center h-20 pt-4 opacity-50'>Nincs betölthető lista</div>}
    </div>
  )
}

export default Lists
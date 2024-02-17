import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare, faEye } from '@fortawesome/free-solid-svg-icons'
import ListItem from './ListItem'

function OtherLists(props) {
  const [lists, setLists] = useState([])
  const [shared, setShared] = useState(true)

  const getLists = async (shared) => {
    const { data } = await axios.get(shared ? 'http://localhost:2000/lists/shared' : 'http://localhost:2000/lists/public')
    setLists(data)
  }

  useEffect(() => {
    getLists(shared).catch(() => {})
  }, [shared])

  return (
    <>
      <div className='flex items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>
        {shared ? 'Megosztott listák' : 'Publikus listák'}
        <div className='relative flex items-center rounded-lg bg-neutral-700/50 overflow-hidden'>
          <div className={`absolute ${shared ? 'left-0' : 'left-1/2'} w-1/2 h-full rounded-lg bg-blue-500 transition-all`}></div>
          <button id='shared' onClick={() => setShared(true)} className={`z-10 flex items-center justify-center w-1/2 px-2 py-1.5 rounded-lg ${!shared ? 'hover:bg-neutral-700/75' : ''} transition-all`}>
            <FontAwesomeIcon icon={faShare} className='h-4' />
          </button>
          <button id='public' onClick={() => setShared(false)} className={`z-10 flex items-center justify-center w-1/2 px-2 py-1.5 rounded-lg ${shared ? 'hover:bg-neutral-700/75' : ''} transition-all`}>
            <FontAwesomeIcon icon={faEye} className='h-4' />
          </button>
        </div>
        <Tooltip anchorSelect='#shared' place='top' className='!text-sm !rounded-lg !bg-neutral-950'>Megosztott listák</Tooltip>
        <Tooltip anchorSelect='#public' place='top' className='!text-sm !rounded-lg !bg-neutral-950'>Publikus listák</Tooltip>
      </div>
      <div className='flex flex-col grow gap-2.5 -mr-2 pr-2 overflow-y-auto'>
        {lists.length > 0 ? lists.map(list => <ListItem key={list.id} onClick={() => {props.setSelectedList(list.id); props.history('/list/editor')}} list={list} />) : <div className='flex items-center justify-center h-full opacity-50'>Nem található lista.</div>}
      </div>
    </>
  )
}

export default OtherLists
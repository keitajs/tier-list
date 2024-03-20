import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare, faEye } from '@fortawesome/free-solid-svg-icons'
import ListItem from './ListItem'

function OtherLists(props) {
  const [query, setQuery] = useState('')
  const [queryValue] = useDebounce(query, 500)
  const [lists, setLists] = useState([])
  const [shared, setShared] = useState(true)

  const getLists = async (shared, query) => {
    const { data } = await axios.get(shared ? 'http://localhost:2000/lists/shared' : `http://localhost:2000/lists/public${query ? `?q=${query}` : ''}`)
    setLists(data)
  }

  useEffect(() => {
    if (!props.loaded) return

    setQuery('')
    getLists(shared).catch((e) => console.log(e))
  }, [shared, props.loaded])

  useEffect(() => {
    if (!shared) getLists(shared, queryValue.toLowerCase().trim()).catch((e) => console.log(e))
  }, [shared, queryValue])

  return (
    <>
      <div className='flex flex-col sm:flex-row gap-2 items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>
        <div className='w-full text-left'>{shared ? 'Megosztott listák' : 'Publikus listák'}</div>

        <div className='flex gap-3 -mx-1 sm:mx-0'>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} className='w-full sm:w-auto px-2 text-sm placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' placeholder='Lista keresése...' />
          <div className='relative flex items-center rounded-lg w-24 sm:w-auto bg-neutral-700/50 overflow-hidden'>
            <div className={`absolute ${shared ? 'left-0' : 'left-1/2'} w-1/2 h-full rounded-lg bg-blue-500 transition-all`}></div>
            <button id='shared' onClick={() => setShared(true)} className={`z-10 flex items-center justify-center w-1/2 px-2 py-1.5 rounded-lg ${!shared ? 'hover:bg-neutral-700/75' : ''} transition-all`}>
              <FontAwesomeIcon icon={faShare} className='h-4' />
            </button>
            <button id='public' onClick={() => setShared(false)} className={`z-10 flex items-center justify-center w-1/2 px-2 py-1.5 rounded-lg ${shared ? 'hover:bg-neutral-700/75' : ''} transition-all`}>
              <FontAwesomeIcon icon={faEye} className='h-4' />
            </button>
          </div>
        </div>
        
        <Tooltip anchorSelect='#shared' place='top' className='!text-sm !rounded-lg !bg-neutral-950'>Megosztott listák</Tooltip>
        <Tooltip anchorSelect='#public' place='top' className='!text-sm !rounded-lg !bg-neutral-950'>Publikus listák</Tooltip>
      </div>
      <div className='flex flex-col grow gap-2.5 -mr-2 pr-2 overflow-y-auto'>
        {lists.length > 0 ? lists.filter(list => shared ? list.name.toLowerCase().includes(query.toLowerCase().trim()) : true).map(list => <ListItem key={list.id} onClick={() => {props.setSelectedList(list.id); props.history('/list/editor')}} list={list} />) : <div className='flex items-center justify-center h-full opacity-50'>Nem található lista.</div>}
      </div>
    </>
  )
}

export default OtherLists
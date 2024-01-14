import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ListItem from './Lists/ListItem'

function Lists(props) {
  const [lists, setLists] = useState([])
  const [publicLists, setPublicLists] = useState([])
  const [activeList, setActiveList] = useState(null)

  const getUserLists = async () => {
    const { data } = await axios.get('http://localhost:2000/user/lists')
    setLists(data)
  }

  const getPublicLists = async () => {
    const { data } = await axios.get('http://localhost:2000/lists/public')
    setPublicLists(data)
  }

  useEffect(() => {
    getUserLists().catch(() => props.history('/'))
    getPublicLists().catch(err => {alert('Server error'); console.log(err)})
  }, [props])

  return (
    <div className='flex h-full gap-6'>
      <div className='w-1/2 h-full rounded-3xl bg-neutral-900 bg-opacity-85'>
        <div className='m-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>Listáid</div>
        <div className='flex flex-col gap-2.5'>
          {lists.map(list => <ListItem list={list} activeList={activeList} onClick={() => setActiveList(list)} />)}
          <button onClick={() => setActiveList(null)} className='group flex items-center justify-center mx-7 mt-2 py-2.5 rounded-xl bg-neutral-950 bg-opacity-30 hover:bg-opacity-20 transition-all'>
            <FontAwesomeIcon icon={faPlus} className='mx-2' />
            <span className='text-xl w-0 max-w-max group-hover:w-32 text-nowrap overflow-hidden transition-[width]'>Új lista</span>
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-6 w-1/2 h-full'>
        <div className='h-1/2 rounded-3xl bg-neutral-900 bg-opacity-85'>
          <div className='m-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>{activeList ? activeList.name : 'Új lista'}</div>
        </div>
        <div className='h-1/2 rounded-3xl bg-neutral-900 bg-opacity-85'>
          {activeList ? <>
            <div className='m-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>Jogosultságok</div>
          </> : <>
            <div className='m-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>Publikus listák</div>
            <div className='flex flex-col gap-2.5'>
              {publicLists.map(list => <ListItem list={list} public={true} />)}
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}

export default Lists
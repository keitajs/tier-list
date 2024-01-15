import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faEllipsis, faDumpsterFire, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
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
    <div className='flex xl:flex-row flex-col h-full gap-6'>
      <div className='p-5 xl:w-1/2 w-full xl:h-full h-max rounded-3xl bg-neutral-900/85'>
        <div className='mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>Listáid</div>
        <div className='flex flex-col gap-2.5'>
          {lists.map(list => <ListItem key={list.id} list={list} activeList={activeList} onClick={() => setActiveList(list)} />)}
          <button onClick={() => setActiveList(null)} className='group flex items-center justify-center mx-2 mt-2 py-2.5 rounded-xl bg-neutral-950/30 hover:bg-neutral-950/20 transition-all'>
            <FontAwesomeIcon icon={faPlus} className='mx-2' />
            <span className='text-xl w-0 max-w-max group-hover:w-32 text-nowrap overflow-hidden transition-[width]'>Új lista</span>
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-6 xl:w-1/2 w-full xl:h-full h-max'>
        <div className='flex flex-col p-5 h-max rounded-3xl bg-neutral-900/85'>
          <div className='mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>{activeList ? activeList.name : 'Új lista'}</div>

          <label className='mb-0.5 ml-1.5' htmlFor="description">Leírás</label>
          <textarea name="description" id="description" rows="2" className='px-2.5 py-1.5 rounded-lg bg-neutral-700/50 outline-none resize-none mb-3'></textarea>

          <label className='mb-0.5 ml-1.5'>Státusz</label>
          <div className='flex gap-2 justify-around mb-3'>
            <button className='relative flex items-center justify-center w-full py-0.5 rounded-lg bg-neutral-700/50 hover:bg-neutral-700/75 transition-all'><FontAwesomeIcon icon={faEllipsis} className='absolute left-2.5 text-white' /> Folyamatban</button>
            <button className='relative flex items-center justify-center w-full py-0.5 rounded-lg bg-neutral-700/50 hover:bg-neutral-700/75 transition-all'><FontAwesomeIcon icon={faCheck} className='absolute left-2.5 text-emerald-500' /> Kész</button>
            <button className='relative flex items-center justify-center w-full py-0.5 rounded-lg bg-neutral-700/50 hover:bg-neutral-700/75 transition-all'><FontAwesomeIcon icon={faDumpsterFire} className='absolute left-2.5 text-red-500' /> Dobott</button>
          </div>

          <label className='mb-0.5 ml-1.5'>Láthatóság</label>
          <div className='flex gap-2 justify-around mb-3'>
            <button className='relative flex items-center justify-center w-full py-0.5 rounded-lg bg-neutral-700/50 hover:bg-neutral-700/75 transition-all'><FontAwesomeIcon icon={faEye} className='absolute left-2.5' /> Publikus</button>
            <button className='relative flex items-center justify-center w-full py-0.5 rounded-lg bg-neutral-700/50 hover:bg-neutral-700/75 transition-all'><FontAwesomeIcon icon={faEyeSlash} className='absolute left-2.5' /> Privát</button>
          </div>

          <div className='flex gap-2 justify-center mt-2'>
            <button className='w-1/5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Létrehozás</button>
            <button className='w-1/5 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
          </div>
        </div>
        <div className='p-5 h-full rounded-3xl bg-neutral-900/85'>
          {activeList ? <>
            <div className='mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>Jogosultságok</div>
          </> : <>
            <div className='mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>Publikus listák</div>
            <div className='flex flex-col gap-2.5'>
              {publicLists.map(list => <ListItem key={list.id} list={list} public={true} />)}
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}

export default Lists
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ListItem from '../../components/List/Lists/ListItem'
import PublicLists from '../../components/List/Lists/PublicLists'
import ManageList from '../../components/List/Lists/ManageList'
import ManagePermission from '../../components/List/Lists/ManagePermission'

function Lists(props) {
  const [lists, setLists] = useState([])
  const [activeList, setActiveList] = useState(null)

  const getUserLists = async () => {
    const { data } = await axios.get('http://localhost:2000/user/lists')
    setLists(data)
  }

  useEffect(() => {
    getUserLists().catch(() => props.history('/'))
  }, [props])

  return (
    <div className='flex xl:flex-row flex-col h-full gap-6'>
      <div className='p-5 xl:w-1/2 w-full xl:h-full h-max rounded-3xl bg-neutral-900/85'>
        <div className='mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>Listáid</div>
        <div className='flex flex-col gap-2.5'>
          {lists.map(list => <ListItem key={list.id} list={list} activeList={activeList} onClick={() => activeList?.id === list.id ? setActiveList(null) : setActiveList(list)} onDoubleClick={() => {props.setSelectedList(list.id); props.history('/list/editor')}} />)}
          <button onClick={() => setActiveList(null)} className='group flex items-center justify-center mx-2 mt-2 py-2.5 rounded-xl bg-neutral-950/30 hover:bg-neutral-950/20 transition-all'>
            <FontAwesomeIcon icon={faPlus} className='mx-2' />
            <span className='text-xl w-0 max-w-max group-hover:w-32 text-nowrap whitespace-nowrap overflow-hidden transition-[width]'>Új lista</span>
          </button>
        </div>
      </div>
      <div className='flex flex-col flex-1 gap-6 xl:w-1/2 w-full h-full max-h-full'>
        <div className='flex flex-col h-max p-5 rounded-3xl bg-neutral-900/85'>
          <ManageList history={props.history} setSelectedList={props.setSelectedList} setLists={setLists} activeList={activeList} setActiveList={setActiveList} />
        </div>
        <div className='flex flex-col flex-nowrap grow gap-5 min-h-0 p-5 rounded-3xl bg-neutral-900/85'>
          {activeList ? <ManagePermission setLists={setLists} activeList={activeList} setActiveList={setActiveList} /> : <PublicLists />}
        </div>
      </div>
    </div>
  )
}

export default Lists
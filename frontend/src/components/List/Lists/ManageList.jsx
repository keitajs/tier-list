import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire, faEye, faEyeSlash, faXmark, faUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Box from '../../ui/Box'

function ManageList({ history, activeList, setActiveList, setLists }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(1)
  const [visible, setVisible] = useState(false)

  const createList = async () => {
    try {
      const { data } = await axios.post('/lists/create', { name, description, status, visible })

      // Hozzáadja és beállítja aktívnak az új listát
      setLists(lists => { return [...lists, { ...data, permissions: [] }] })
      setActiveList({ ...data, permissions: [] })
    } catch (err) { alert('Server error'); console.log(err) }
  }

  const updateList = async () => {
    try {
      await axios.patch(`/lists/${activeList.id}/update`, { name, description, status, visible })

      // Módosítja az adatokat a változókban
      setLists(lists => {
        const list = lists.find(list => list.id === activeList.id)
        list.name = name
        list.description = description
        list.status = status
        list.private = !visible
        setActiveList({ ...list })
        return lists
      })
    } catch (err) { alert('Server error'); console.log(err) }
  }

  const removeList = async () => {
    try {
      await axios.delete(`/lists/${activeList.id}/remove`)

      // Törli a listát a többi közül
      setLists(lists => {
        lists.splice(lists.findIndex(list => list.id === activeList.id), 1)
        return lists
      })
      setActiveList(null)
    } catch (err) { alert('Server error'); console.log(err) }
  }

  useEffect(() => {
    // Aktív lista esetén annak az adatait írja be a mezőkbe
    if (activeList) {
      setName(activeList.name)
      setDescription(activeList.description)
      setStatus(activeList.status)
      setVisible(!activeList.private)
    } else {
      setName('Új lista')
      setDescription('')
      setStatus(1)
      setVisible(false)
    }
  }, [activeList])

  return (
    <Box>
      <div className='flex justify-between gap-3 mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
        <div className='relative flex items-center grow'>
          <input type='text' name="name" id="name" value={name} onChange={e => setName(e.target.value)} placeholder='Lista neve' className='w-full max-w-80 px-2 -mx-2 rounded-lg placeholder:text-neutral-500 bg-neutral-700/50 outline-none resize-none' />
          {!name ? <div className='absolute top-1/2 right-0 -translate-y-1/2 flex items-center'><FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' /></div> : <></>}
        </div>
        <div className={`flex items-center gap-3 text-sm w-max ${activeList ? 'opacity-1 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity`}>
          <button onClick={() => history(`/list/editor?id=${activeList.id}`)} className='flex items-center gap-2 opacity-75 hover:opacity-90 transition-opacity'><span className='hidden sm:inline'>Megnyitás</span><FontAwesomeIcon icon={faUpRightFromSquare} /></button>
          <button onClick={removeList} className='flex items-center gap-2 group text-rose-600 hover:text-rose-500 ml-0 sm:hover:ml-2 transition-all'><div className='hidden sm:inline sm:w-0 sm:group-hover:w-32 sm:max-w-max overflow-hidden transition-all'>Törlés</div><FontAwesomeIcon icon={faTrash} /></button>
        </div>
      </div>

      <label className='mb-0.5 ml-1.5' htmlFor="description">Leírás</label>
      <textarea name="description" id="description" rows="2" value={description} onChange={e => setDescription(e.target.value)} className='px-2.5 py-1.5 rounded-lg bg-neutral-700/50 outline-none resize-none mb-3'></textarea>

      <label className='mb-0.5 ml-1.5'>Státusz</label>
      <div className='flex flex-col sm:flex-row gap-2 justify-around mb-3'>
        <button onClick={() => setStatus(1)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${status === 1 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEllipsis} className='absolute left-2.5 text-white' /> Folyamatban</button>
        <button onClick={() => setStatus(2)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${status === 2 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faCheck} className='absolute left-2.5 text-emerald-500' /> Kész</button>
        <button onClick={() => setStatus(3)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${status === 3 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faDumpsterFire} className='absolute left-2.5 text-red-500' /> Dobott</button>
      </div>

      <label className='mb-0.5 ml-1.5'>Láthatóság</label>
      <div className='flex flex-col sm:flex-row gap-2 justify-around mb-3'>
        <button onClick={() => setVisible(true)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${visible ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEye} className='absolute left-2.5' /> Publikus</button>
        <button onClick={() => setVisible(false)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${!visible ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEyeSlash} className='absolute left-2.5' /> Privát</button>
      </div>

      <div className='flex gap-2 justify-center mt-2'>
        <button onClick={() => activeList ? updateList() : createList()} className='w-full sm:w-2/5 xl:w-1/5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>{activeList ? 'Mentés' : 'Létrehozás'}</button>
        {activeList ? <button onClick={() => setActiveList(null)} className='w-full sm:w-2/5 xl:w-1/5 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button> : <></>}
      </div>
    </Box>
  )
}

export default ManageList
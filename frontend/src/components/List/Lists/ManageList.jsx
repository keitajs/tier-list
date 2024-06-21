import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire, faEye, faEyeSlash, faXmark, faUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Select, SelectButton } from '../../ui/Select'
import Button from '../../ui/Button'

function ManageList({ history, activeList, setActiveList }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(1)
  const [visible, setVisible] = useState(false)

  const createList = async () => {
    try {
      const { data } = await axios.post('/lists/create', { name, description, status, visible })
      setActiveList({ ...data, permissions: [] })
    } catch (err) { alert('Server error'); console.log(err) }
  }

  const updateList = async () => {
    try {
      await axios.patch(`/lists/${activeList.id}/update`, { name, description, status, visible })
      setActiveList(list => ({ id: list.id, name, description, status, private: !visible, permissions: list.permissions }))
    } catch (err) { alert('Server error'); console.log(err) }
  }

  const removeList = async () => {
    try {
      await axios.delete(`/lists/${activeList.id}/remove`)
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
    <>
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
      <Select value={status} setValue={setStatus} startIndex={1} className='w-full mb-3'>
        <SelectButton icon={faEllipsis} iconClassName='text-blue-400'>
          Folyamatban
        </SelectButton>
        <SelectButton icon={faCheck} iconClassName='text-emerald-500'>
          Kész
        </SelectButton>
        <SelectButton icon={faDumpsterFire} iconClassName='text-red-500'>
          Dobott
        </SelectButton>
      </Select>

      <label className='mb-0.5 ml-1.5'>Láthatóság</label>
      <Select value={visible} setValue={setVisible} values={[true, false]} className='w-full mb-3'>
        <SelectButton icon={faEye}>
          Publikus
        </SelectButton>
        <SelectButton icon={faEyeSlash}>
          Privát
        </SelectButton>
      </Select>

      <div className='flex gap-2 justify-center mt-2'>
        {activeList ? <>
          <Button width='1/3' color='success' onClick={updateList}>Mentés</Button>
          <Button width='1/3' color='danger' onClick={() => setActiveList(null)}>Mégsem</Button>
        </> :
          <Button width='1/3' color='success' onClick={createList}>Létrehozás</Button>
        }
      </div>
    </>
  )
}

export default ManageList
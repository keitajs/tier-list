import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faArrowsUpDownLeftRight, faPen } from '@fortawesome/free-solid-svg-icons'

function EditPermission(props) {
  const [name, setName] = useState('')
  const [permission, setPermission] = useState(1)

  const createPermission = () => {
    alert('create')
  }

  const updatePermission = () => {
    alert('update')
  }

  useEffect(() =>{
    if (props.active.edit) {
      setName(props.active.user.username)
      setPermission(props.active.permission)
    } else {
      setName('')
      setPermission(1)
    }
  }, [props.active])

  return (
    <div className='flex flex-col h-max'>
      <div className='mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>{props.active.edit ? 'Felhasználó kezelése' : 'Felhasználó hozzáadása'}</div>

      <label className='mb-0.5 ml-1.5' htmlFor="name">Felhasználó</label>
      <input type='text' name="name" id="name" value={name} onChange={e => setName(e.target.value)} className='px-2.5 py-1.5 rounded-lg bg-neutral-700/50 outline-none resize-none mb-3' />

      <label className='mb-0.5 ml-1.5'>Jogosultság</label>
      <div className='flex gap-2 justify-around mb-3'>
        <button onClick={() => setPermission(1)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${permission === 1 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEye} className='absolute left-2.5' /> Megtekintés</button>
        <button onClick={() => setPermission(2)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${permission === 2 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faArrowsUpDownLeftRight} className='absolute left-2.5' /> Mozgatás</button>
        <button onClick={() => setPermission(3)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${permission === 3 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faPen} className='absolute left-2.5' /> Szerkesztés</button>
      </div>

      <div className='flex gap-2 justify-center mt-2'>
        <button onClick={() => props.active.edit ? updatePermission() : createPermission()} className='w-1/5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>{props.active.edit ? 'Módosítás' : 'Hozzáadás'}</button>
        <button onClick={() => props.setActive(null)} className='w-1/5 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
      </div>
    </div>
  )
}

export default EditPermission
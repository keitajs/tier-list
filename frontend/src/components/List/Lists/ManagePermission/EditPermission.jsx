import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faArrowsUpDownLeftRight, faPen, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'

function EditPermission({ active, setActive, activeList, setActiveList }) {
  const [name, setName] = useState('')
  const [nameMsg, setNameMsg] = useState('Írj be egy felhasználónevet!')
  const [permission, setPermission] = useState(1)

  const createPermission = async () => {
    try {
      const { data } = await axios.post(`/lists/${activeList.id}/permissions/create`, { username: name, permission })
      
      // A jelenleg aktív szerkesztési folyamatot null-ra (nincsre) állítja
      setActive(null)

      // Hozzáadja az activeListához a jogosultságot, majd lementi a listákban is
      activeList.permissions.push(data)
      setActiveList({ ...activeList })
    } catch (error) {
      // Megjeleníti a felhasználónévnél a hibaüzenetet
      setNameMsg(error.response.data.message)
    }
  }

  const updatePermission = async () => {
    try {
      await axios.patch(`/lists/${activeList.id}/permissions/update/${active.user.id}`, { value: permission })

      // A jelenleg aktív szerkesztési folyamatot null-ra (nincsre) állítja
      setActive(null)

      // Módosítja az activeListában a jogosultságot, majd átírja a listákban is
      const _ = activeList.permissions.find(permission => permission.id === active.id)
      _.value = permission
      setActiveList({ ...activeList })
    } catch (error) { alert('Server error'); console.log(error) }
  }

  const removePermission = async () => {
    try {
      await axios.delete(`/lists/${activeList.id}/permissions/remove/${active.user.id}`)
      
      // A jelenleg aktív szerkesztési folyamatot null-ra (nincsre) állítja
      setActive(null)

      // Kiveszi a jogosultságot és átírja a listákban is
      activeList.permissions.splice(activeList.permissions.find(permission => permission.id === active.id), 1)
      setActiveList({ ...activeList })
    } catch (error) { alert('Server error'); console.log(error) }
  }

  useEffect(() =>{
    // Beállítja a megfelelő értékeket az alapján, hogy épp szerkeszt vagy új jogosultságot ad hozzá
    if (active.edit) {
      setName(active.user.username)
      setPermission(active.value)
    } else {
      setName('')
      setPermission(1)
    }
  }, [active])

  useEffect(() => {
    // Felhasználónév mező üresség ellenőrzés
    if (name === '') setNameMsg('Írj be egy felhasználónevet!')
    else setNameMsg('')
  }, [name])

  return (
    <div className='flex flex-col h-max'>
      <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
        {active.edit ? 'Felhasználó kezelése' : 'Felhasználó hozzáadása'}
        {active.edit ? <button onClick={removePermission} className='flex items-center gap-2 group text-sm text-rose-600 hover:text-rose-500 ml-0 hover:ml-2 transition-all'><div className='w-0 group-hover:w-32 max-w-max overflow-hidden transition-all'>Törlés</div><FontAwesomeIcon icon={faTrash} /></button> : <></>}
      </div>

      <label className='mb-0.5 ml-1.5' htmlFor="name">Felhasználó {nameMsg ? <span className='ml-0.5 text-sm text-rose-600'>{nameMsg}</span> : <></>}</label>
      <div className='relative w-full mb-3'>
        <input type='text' name="name" id="name" value={name} onChange={e => setName(e.target.value)} disabled={active.edit} className='w-full pl-2.5 pr-10 py-1.5 rounded-lg bg-neutral-700/50 outline-none resize-none' />
        {nameMsg ? <div className='absolute top-1/2 right-3 -translate-y-1/2 flex items-center'><FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' /></div> : <></>}
      </div>

      <label className='mb-0.5 ml-1.5'>Jogosultság</label>
      <div className='flex flex-col sm:flex-row gap-2 justify-around mb-3'>
        <button onClick={() => setPermission(1)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${permission === 1 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEye} className='absolute left-2.5' /> Megtekintés</button>
        <button onClick={() => setPermission(2)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${permission === 2 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faArrowsUpDownLeftRight} className='absolute left-2.5' /> Mozgatás</button>
        <button onClick={() => setPermission(3)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${permission === 3 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faPen} className='absolute left-2.5' /> Szerkesztés</button>
      </div>

      <div className='flex gap-2 justify-center mt-2'>
        <button onClick={() => active.edit ? updatePermission() : createPermission()} className='w-full sm:w-2/5 xl:w-1/5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors' disabled={nameMsg !== ''}>{active.edit ? 'Módosítás' : 'Hozzáadás'}</button>
        <button onClick={() => setActive(null)} className='w-full sm:w-2/5 xl:w-1/5 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
      </div>
    </div>
  )
}

export default EditPermission
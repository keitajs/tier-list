import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsis, faDumpsterFire, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'

function ManageList(props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (props.activeList) {
      setName(props.activeList.name)
      setDescription(props.activeList.description)
      setStatus(props.activeList.status)
      setVisible(!props.activeList.private)
    } else {
      setName('Új lista')
      setDescription('')
      setStatus(1)
      setVisible(false)
    }
  }, [props.activeList])

  return (
    <>
      <div className='mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
        <div className='relative flex items-center w-max'>
          <input type='text' name="name" id="name" value={name} onChange={e => setName(e.target.value)} placeholder='Lista neve' className='px-2 -mx-2 rounded-lg placeholder:text-neutral-500 bg-neutral-700/50 outline-none resize-none' />
          {!name ? <div className='absolute top-1/2 right-0 -translate-y-1/2 flex items-center'><FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' /></div> : <></>}
        </div>
      </div>

      <label className='mb-0.5 ml-1.5' htmlFor="description">Leírás</label>
      <textarea name="description" id="description" rows="2" value={description} onChange={e => setDescription(e.target.value)} className='px-2.5 py-1.5 rounded-lg bg-neutral-700/50 outline-none resize-none mb-3'></textarea>

      <label className='mb-0.5 ml-1.5'>Státusz</label>
      <div className='flex gap-2 justify-around mb-3'>
        <button onClick={() => setStatus(1)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${status === 1 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEllipsis} className='absolute left-2.5 text-white' /> Folyamatban</button>
        <button onClick={() => setStatus(2)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${status === 2 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faCheck} className='absolute left-2.5 text-emerald-500' /> Kész</button>
        <button onClick={() => setStatus(3)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${status === 3 ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faDumpsterFire} className='absolute left-2.5 text-red-500' /> Dobott</button>
      </div>

      <label className='mb-0.5 ml-1.5'>Láthatóság</label>
      <div className='flex gap-2 justify-around mb-3'>
        <button onClick={() => setVisible(true)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${visible ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEye} className='absolute left-2.5' /> Publikus</button>
        <button onClick={() => setVisible(false)} className={`relative flex items-center justify-center w-full py-0.5 rounded-lg ${!visible ? 'bg-blue-500' : 'bg-neutral-700/50 hover:bg-neutral-700/75'} transition-all`}><FontAwesomeIcon icon={faEyeSlash} className='absolute left-2.5' /> Privát</button>
      </div>

      <div className='flex gap-2 justify-center mt-2'>
        <button className='w-1/5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>{props.activeList ? 'Mentés' : 'Létrehozás'}</button>
        {props.activeList ? <button onClick={() => props.setActiveList(null)} className='w-1/5 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button> : <></>}
      </div>
    </>
  )
}

export default ManageList
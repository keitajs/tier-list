import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

function Username(props) {
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})

  const update = async () => {
    if (Object.values(errors).find(x => !!x)) return

    try {
      await axios.patch('/user/username', { username: name })
      props.setEdit(null)
      props.setUser(user => {
        user.username = name
        return user
      })
    } catch (err) {
      if (err?.response?.data?.errors) return setErrors({ name: err.response.data.errors.username })
      alert('Server error')
      console.log(err)
    }
  }

  useEffect(() => {
    if (!name) return setErrors(errors => { return {...errors, name: 'Üres mező!' } })
    if (name === props.user.username) return setErrors(errors => { return {...errors, name: 'Jelenleg is ez a neved!' } })
    setErrors(errors => { return {...errors, name: false } })
  }, [name, props.user.username])

  useEffect(() => {
    if (!props.hide) setName('')
  }, [props.hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${props.hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Felhasználónév módosítás
        </div>

        <div className='flex flex-col text-lg'>
          <label htmlFor="name" className='ml-1'>Új felhasználónév</label>
          <div className='relative'>
            <input type="text" value={name} maxLength={256} onChange={e => setName(e.target.value)} name='name' id='name' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'><FontAwesomeIcon icon={errors.name ? faXmark : faCheck} className={errors.name ? 'text-rose-500 h-5 input-error-anim' : 'text-emerald-500 h-5 input-check-anim'} /></div>
          </div>
          <span className='text-base ml-1 text-rose-600'>{errors.name}</span>
        </div>

        <div className='flex gap-2 mt-5'>
          <button onClick={update} className='w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Módosítás</button>
          <button onClick={() => props.setEdit(null)} className='w-full py-1 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
        </div>
      </div>
    </div>
  )
}

export default Username
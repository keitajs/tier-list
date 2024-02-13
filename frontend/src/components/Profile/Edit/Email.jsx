import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

function Email(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const update = async () => {
    if (Object.values(errors).find(x => !!x)) return

    try {
      await axios.patch('http://localhost:2000/user/email', { email, password })
      props.setEdit(null)
      props.setUser(user => {
        user.email = email
        return user
      })
    } catch (err) {
      if (err?.response?.data?.message) return setErrors(errors => {
        errors[err.response.data.field] = err.response.data.message
        return { ...errors }
      })
      alert('Server error')
      console.log(err)
    }
  }

  useEffect(() => {
    if (!email) return setErrors(errors => { return { ...errors, email: 'Üres mező!' } })
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) return setErrors(errors => { return { ...errors, email: 'Hibás formátum!' } })
    if (email === props.user.email) return setErrors(errors => { return { ...errors, email: 'Jelenleg is ez az email van beállítva!' } })
    setErrors(errors => { return { ...errors, email: false } })
  }, [email, props.user.email])

  useEffect(() => {
    if (!password) return setErrors(errors => { return { ...errors, password: 'Üres mező!' } })
    setErrors(errors => { return { ...errors, password: false } })
  }, [password])

  useEffect(() => {
    if (!props.hide) {
      setEmail('')
      setPassword('')
    }
  }, [props.hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${props.hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Email módosítás
        </div>

        <div className='flex flex-col text-lg mb-1.5'>
          <label htmlFor="email" className='ml-1'>Új email</label>
          <div className='relative'>
            <input type="text" value={email} maxLength={256} onChange={e => setEmail(e.target.value)} name='email' id='email' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{!errors.email ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
          </div>
          <span className='text-base ml-1 text-rose-600'>{errors.email}</span>
        </div>

        <div className='flex flex-col text-lg'>
          <label htmlFor="password" className='flex ml-1'>
            Jelszó
          </label>
          <div className='relative'>
            <input type='password' value={password} maxLength={256} onChange={e => setPassword(e.target.value)} name='password' id='password' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{!errors.password ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
          </div>
          <span className='text-base ml-1 text-rose-600'>{errors.password}</span>
        </div>

        <div className='flex gap-2 mt-5'>
          <button onClick={update} className='w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Módosítás</button>
          <button onClick={() => props.setEdit(null)} className='w-full py-1 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
        </div>
      </div>
    </div>
  )
}

export default Email
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

function Password(props) {
  const [password, setPassword] = useState('')
  const [passwor2, setPasswor2] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})

  const update = async () => {
    if (Object.values(errors).find(x => !!x)) return

    try {
      await axios.patch('http://localhost:2000/user/password', { password, currentPassword })
      props.setEdit(null)
    } catch (err) {
      const { errors: results } = err?.response?.data
      if (results) return setErrors(errors => {
        if (results.password) errors.password = results.password
        if (results.currentPassword) errors.currentPassword = results.currentPassword
        return { ...errors }
      })

      alert('Server error')
      console.log(err)
    }
  }

  useEffect(() => {
    if (password !== passwor2) setErrors(errors => { return { ...errors, passwor2: 'Két jelszó nem egyezik!' } })
    else if (passwor2 !== '') setErrors(errors => { return { ...errors, passwor2: false } })
    if (!password) return setErrors(errors => { return { ...errors, password: 'Üres mező!' } })
    if (password.length < 8) return setErrors(errors => { return { ...errors, password: 'Túl rövid!' } })
    setErrors(errors => { return {...errors, password: false } })
  }, [password, passwor2])

  useEffect(() => {
    if (!password) return setErrors(errors => { return { ...errors, passwor2: 'Üres mező!' } })
    if (password !== passwor2) return setErrors(errors => { return { ...errors, passwor2: 'Két jelszó nem egyezik!' } })
    setErrors(errors => { return {...errors, passwor2: false } })
  }, [password, passwor2])

  useEffect(() =>{
    if (!currentPassword) return setErrors(errors => { return { ...errors, currentPassword: 'Üres mező!' } })
    setErrors(errors => { return {...errors, currentPassword: false } })
  }, [currentPassword])

  useEffect(() => {
    if (!props.hide) {
      setPassword('')
      setPasswor2('')
      setCurrentPassword('')
    }
  }, [props.hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${props.hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Jelszó módosítás
        </div>

        <div className='flex flex-col text-lg mb-1.5'>
          <label htmlFor="password" className='flex ml-1'>
            Új jelszó
            <button onClick={() => setShowPass(!showPass)} className='flex items-center px-2'>{showPass ? <FontAwesomeIcon icon={faEyeSlash} className='h-3' /> : <FontAwesomeIcon icon={faEye} className='h-3' />}</button>
          </label>
          <div className='relative'>
            <input type={showPass ? 'text' : 'password'} value={password} maxLength={256} onChange={e => setPassword(e.target.value)} name='password' id='password' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{!errors.password ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
          </div>
          <span className='text-base ml-1 text-rose-600'>{errors.password}</span>
        </div>

        <div className='flex flex-col text-lg mb-1.5'>
          <label htmlFor="password" className='ml-1'>Jelszó újra</label>
          <div className='relative'>
            <input type="password" value={passwor2} maxLength={256} onChange={e => setPasswor2(e.target.value)} name='password' id='password' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{!errors.passwor2 ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
          </div>
          <span className='text-base ml-1 text-rose-600'>{errors.passwor2}</span>
        </div>

        <div className='flex flex-col text-lg'>
          <label htmlFor="password" className='flex ml-1'>
            Jelenlegi jelszó
          </label>
          <div className='relative'>
            <input type='password' value={currentPassword} maxLength={256} onChange={e => setCurrentPassword(e.target.value)} name='password' id='password' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{!errors.currentPassword ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
          </div>
          <span className='text-base ml-1 text-rose-600'>{errors.currentPassword}</span>
        </div>

        <div className='flex gap-2 mt-5'>
          <button onClick={update} className='w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Módosítás</button>
          <button onClick={() => props.setEdit(null)} className='w-full py-1 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
        </div>
      </div>
    </div>
  )
}

export default Password
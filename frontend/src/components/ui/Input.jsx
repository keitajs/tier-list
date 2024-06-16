import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Input({ label, name, type, value, onChange, message, reset, disabled }) {
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (type !== 'password') return
    setShowPass(false)
  }, [reset, type])

  return (
    <div className="w-64 mt-1.5 lg:mt-6 flex flex-col">
      <div className='flex'>
        <label htmlFor={name} className='ml-1 mb-0.5 text-lg'>{label}</label>
        {type === 'password' ? <button onClick={() => setShowPass(!showPass)} className='flex items-center px-2'><FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className='h-3' /></button> : <></>}
      </div>
      <div className='relative'>
        <input type={type === 'password' ? (showPass ? 'text' : 'password') : type} name={name} id={name} className={`w-64 px-3 pr-10 py-2 bg-neutral-700/75 rounded-lg outline-none`} value={value} onChange={onChange} disabled={disabled} />
        <div className='absolute top-1/2 right-4 -translate-y-1/2 flex items-center'>
          <FontAwesomeIcon icon={message ? faXmark : faCheck} className={message ? 'text-rose-500 h-5 input-error-anim' : 'text-emerald-500 h-5 input-check-anim'} />
        </div>
      </div>
      <span className='w-64 ml-1 text-sm text-rose-600'>{message}</span>
    </div>
  )
}
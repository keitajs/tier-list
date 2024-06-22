import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Input({ children, label, name, type, maxLength, value, onChange, message, hideMessage, onlyMessage, reset, disabled, mainClass, labelClass, className }) {
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (type !== 'password') return
    setShowPass(false)
  }, [reset, type])

  return (
    <div className={`w-64 flex flex-col ${mainClass ?? ''}`}>
      <div className='flex'>
        <label htmlFor={name} className={`ml-1 mb-0.5 text-lg ${labelClass ?? ''}`}>{label}</label>
        {type === 'password' ? <button onClick={() => setShowPass(!showPass)} className='flex items-center px-2'><FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className='h-3' /></button> : <></>}
      </div>
      <div className='relative'>
        <input type={type === 'password' ? (showPass ? 'text' : 'password') : type} name={name} id={name} maxLength={maxLength} className={`w-64 px-3 ${onlyMessage && !message ? 'pr-3' : 'pr-10'} py-2 bg-neutral-700/75 rounded-lg outline-none ` + (className ?? '')} value={value} onChange={onChange} disabled={disabled} />
        
        {!(onlyMessage && !message) &&
          <div className='absolute top-1/2 right-3 -translate-y-1/2 flex items-center'>
            <FontAwesomeIcon icon={message ? faXmark : faCheck} className={message ? 'text-rose-500 h-5 input-error-anim' : 'text-emerald-500 h-5 input-check-anim'} />
          </div>
        }

        {children}
      </div>
      {!hideMessage && <span className='w-64 ml-1 text-sm text-rose-600'>{message}</span>}
    </div>
  )
}
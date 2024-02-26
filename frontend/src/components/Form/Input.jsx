import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function Input(props) {
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (props.type !== 'password') return
    setShowPass(false)
  }, [props.reset, props.type])

  return (
    <div className="mt-1.5 lg:mt-6 flex flex-col">
      <div className='flex'>
        <label htmlFor={props.name} className='ml-1 mb-0.5 text-lg'>{props.label}</label>
        {props.type === 'password' ? <button onClick={() => setShowPass(!showPass)} className='flex items-center px-2'><FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} className='h-3' /></button> : <></>}
      </div>
      <div className='relative'>
        <input type={props.type === 'password' ? (showPass ? 'text' : 'password') : props.type} name={props.name} id={props.name} className={`w-64 px-3 pr-10 py-2 bg-neutral-700/75 rounded-lg outline-none`} value={props.value} onChange={props.onChange} />
        <div className='absolute top-1/2 right-4 -translate-y-1/2 flex items-center'>
          <FontAwesomeIcon icon={props.message ? faXmark : faCheck} className={props.message ? 'text-rose-500 h-5 input-error-anim' : 'text-emerald-500 h-5 input-check-anim'} />
        </div>
      </div>
      <span className='w-64 ml-1 text-sm text-rose-600'>{props.message}</span>
    </div>
  )
}

export default Input
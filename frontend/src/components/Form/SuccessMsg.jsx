import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

function SuccessMsg(props) {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-emerald-600 success-box-anim'>
      <div className='text-center w-full py-2 bg-emerald-600 z-10'>
        <FontAwesomeIcon icon={faCheck} className='h-8 success-check-anim' />
      </div>
      <div className='h-14 flex flex-col items-center overflow-hidden'>
        <span className='text-2xl success-msg-anim'>{props.msg}</span>
        <span className='text-sm success-msg2-anim'>{props.text}</span>
      </div>
    </div>
  )
}

export default SuccessMsg
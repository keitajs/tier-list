import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Input({ children, label, name, rows, maxLength, value, onChange, message, hideMessage, onlyMessage, disabled, mainClass, labelClass, className }) {
  return (
    <div className={`w-64 flex flex-col ${mainClass ?? ''}`}>
      <div className='flex items-end justify-between'>
        <label htmlFor={name} className={`ml-1 mb-0.5 text-lg ${labelClass ?? ''}`}>{label}</label>
        {maxLength && <p className='mr-1 mb-0.5 text-xs opacity-50'>{value.length}/{maxLength}</p>}
      </div>
      <div className='relative'>
        <textarea name={name} id={name} rows={rows ?? 2} maxLength={maxLength} value={value} onChange={onChange} className={`w-64 px-3 py-2 ${onlyMessage && !message ? 'pr-3' : 'pr-10'} bg-neutral-700/75 rounded-lg outline-none resize-none ` + (className ?? '')} disabled={disabled}></textarea>
        
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
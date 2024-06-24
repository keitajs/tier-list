import { useEffect, useState, createContext, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const PasswordContext = createContext(false)

function PasswordProvider({ children, value }) {
  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  )
}

export function InputContainer({ children, className }) {
  const [hide, setHide] = useState(true)

  return (
    <PasswordProvider value={{ hide, setHide }}>
      <div className={`w-max flex flex-col ${className ?? ''}`}>
        {children}
      </div>
    </PasswordProvider>
  )
}

export function Label({ children, htmlFor, password, className }) {
  const { hide, setHide } = useContext(PasswordContext)

  return (
    <div className='flex'>
      <label htmlFor={htmlFor} className={`ml-1 mb-0.5 text-lg ${className ?? ''}`}>
        {children}
      </label>

      {password &&
        <button onClick={() => setHide(!hide)} className='flex items-center px-2'>
          <FontAwesomeIcon icon={hide ? faEye : faEyeSlash} className='h-3' />
        </button>
      }
    </div>
  )
}

export function Input({ children, id, name, type, maxLength, defaultValue, value, setValue, onChange, error, onlyError, reset, disabled, className }) {
  const { hide, setHide } = useContext(PasswordContext)

  useEffect(() => {
    if (type !== 'password') return
    setHide(true)
  }, [reset, type])

  return (
    <div className='relative'>
      <input
        id={id}
        name={name}
        type={type === 'password' ? (hide ? 'password' : 'text') : type}
        defaultValue={defaultValue}
        value={value}
        onChange={setValue ? (e) => setValue(e.target.value) : onChange}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-64 px-3 ${onlyError && !error ? 'pr-3' : 'pr-10'} py-2 bg-neutral-700/75 rounded-lg outline-none ${className ?? ''}`}
      />
      
      {!(onlyError && !error) &&
        <div className='absolute top-1/2 right-3 -translate-y-1/2 flex items-center'>
          <FontAwesomeIcon icon={error ? faXmark : faCheck} className={error ? 'text-rose-500 h-5 input-error-anim' : 'text-emerald-500 h-5 input-check-anim'} />
        </div>
      }

      {children}
    </div>
  )
}

export function Textarea({ children, id, name, rows, maxLength, defaultValue, value, setValue, onChange, error, onlyError, disabled, className }) {
  return (
    <div className='relative'>
      <textarea
        id={id}
        name={name}
        rows={rows ?? 2}
        maxLength={maxLength}
        defaultValue={defaultValue}
        value={value}
        onChange={setValue ? (e) => setValue(e.target.value) : onChange}
        className={`w-64 px-3 pt-2 pb-2 ${onlyError && !error ? 'pr-3' : 'pr-10'} bg-neutral-700/75 rounded-lg outline-none resize-none ${className ?? ''}`}
        disabled={disabled}
      ></textarea>
      
      {!(onlyError && !error) &&
        <div className='absolute top-1/2 right-3 -translate-y-1/2 flex items-center'>
          <FontAwesomeIcon icon={error ? faXmark : faCheck} className={error ? 'text-rose-500 h-5 input-error-anim' : 'text-emerald-500 h-5 input-check-anim'} />
        </div>
      }

      {maxLength && <p className='absolute right-1 bottom-full mb-0.5 text-xs opacity-50'>{value.length}/{maxLength}</p>}

      {children}
    </div>
  )
}

export function Error({ children, hide }) {
  return children && !hide && <span className='w-64 ml-1 text-sm text-rose-600'>{children}</span>
}
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

export default function SuccessMsg({ msg, text }) {
  return (
    <div className='absolute inset-0 rounded-3xl bg-neutral-800 overflow-hidden animate-login-success-box'>
      <div className='flex flex-col items-center justify-center w-full h-full bg-neutral-900/50'>
        <div className='text-center w-full bg-neutral-800 z-10'>
          <div className='w-full h-full py-2 bg-neutral-900/50'>
            <FontAwesomeIcon icon={faCheck} className='h-8 animate-login-success-check' />
          </div>
        </div>
        <div className='h-14 flex flex-col items-center overflow-hidden'>
          <span className='text-2xl animate-login-success-title'>{msg}</span>
          <span className='text-sm animate-login-success-subtitle'>{text}</span>
        </div>
      </div>
    </div>
  )
}
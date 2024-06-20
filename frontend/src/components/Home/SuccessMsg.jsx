import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

export default function SuccessMsg({ msg, text }) {
  return (
    <div className='absolute inset-0 rounded-3xl bg-neutral-800 overflow-hidden success-box-anim'>
      <div className='flex flex-col items-center justify-center w-full h-full bg-neutral-900/50'>
        <div className='text-center w-full bg-neutral-800 z-10'>
          <div className='w-full h-full py-2 bg-neutral-900/50'>
            <FontAwesomeIcon icon={faCheck} className='h-8 success-check-anim' />
          </div>
        </div>
        <div className='h-14 flex flex-col items-center overflow-hidden'>
          <span className='text-2xl success-msg-anim'>{msg}</span>
          <span className='text-sm success-msg2-anim'>{text}</span>
        </div>
      </div>
    </div>
  )
}
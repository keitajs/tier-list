import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavItem({ text, pathname, icon, disabled }) {
  const isCurrent = window.location.pathname === pathname

  return (
    <Link to={disabled ? '' : pathname} className={`group relative w-full flex flex-col items-center justify-center gap-0.5 pt-4 pb-3 ${disabled ? 'pointer-events-none' : ''}`}>
      <FontAwesomeIcon icon={icon} className='h-4' />
      <div className='text-xs'>{text}</div>
      <div className={`absolute ${isCurrent ? 'bottom-0' : '-bottom-2 group-hover:bottom-0'} left-1/4 right-1/4 h-1 rounded-t-lg ${isCurrent ? 'bg-blue-500' : 'bg-white'} transition-all`}></div>
    </Link>
  )
}
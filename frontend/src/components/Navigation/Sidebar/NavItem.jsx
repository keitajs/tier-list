import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavItem({ text, pathname, icon, disabled }) {
  const isCurrent = window.location.pathname.slice(0, window.location.pathname.split('/', 2).join('/').length) === pathname

  return (
    <Link to={disabled ? '' : pathname} className={`group/navitem relative flex items-center gap-4 h-12 text-lg ${disabled ? 'pointer-events-none' : ''}`}>
      <FontAwesomeIcon icon={icon} className='w-6' />
      <div className={`opacity-0 group-hover:opacity-100 transition-opacity`}>{text}</div>
      <div className={`absolute ${isCurrent ? '-left-4' : '-left-6 group-hover/navitem:-left-4'} h-2/3 w-1 rounded-e-lg ${isCurrent ? 'bg-blue-500' : 'bg-white'} transition-all`}></div>
    </Link>
  )
}
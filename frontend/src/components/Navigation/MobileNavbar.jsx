import { faHome, faUser, faList, faPen } from '@fortawesome/free-solid-svg-icons'
import NavItem from './mobile/NavItem'

export default function MobileNavbar({ logged, selectedList }) {
  return (
    <div className='fixed left-0 bottom-0 right-0 flex sm:hidden justify-between px-4 rounded-t-3xl shadow-lg overflow-hidden z-30 bg-neutral-900'>
      <NavItem text={'Főoldal'} icon={faHome} pathname={'/'} />
      <NavItem text={'Profil'} icon={faUser} pathname={'/profile'} disabled={!logged} />
      {selectedList ? <NavItem text={'Editor'} icon={faPen} pathname={'/list/editor'} disabled={!logged} /> : <></>}
      <NavItem text={'Listák'} icon={faList} pathname={'/list'} disabled={!logged} />
    </div>
  )
}
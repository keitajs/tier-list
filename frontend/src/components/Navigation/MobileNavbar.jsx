import React from 'react'
import { faHome, faUser, faList, faPen } from '@fortawesome/free-solid-svg-icons'
import NavItem from './MobileNavbar/NavItem'

function MobileNavbar(props) {
  return (
    <div className='fixed left-0 bottom-0 right-0 flex sm:hidden justify-between px-4 rounded-t-3xl shadow-lg overflow-hidden z-30 bg-neutral-900'>
      <NavItem text={'Főoldal'} icon={faHome} pathname={'/'} />
      <NavItem text={'Profil'} icon={faUser} pathname={'/profile'} />
      {props.selectedList ? <NavItem text={'Editor'} icon={faPen} pathname={'/list/editor'} /> : <></>}
      <NavItem text={'Listák'} icon={faList} pathname={'/list'} />
    </div>
  )
}

export default MobileNavbar
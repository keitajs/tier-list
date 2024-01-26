import React from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faHome, faUser, faList, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import NavItem from './Sidebar/NavItem'
import ListItem from './Sidebar/ListItem'

function Sidebar(props) {
  const Logout = () => {
    axios.delete('http://localhost:2000/logout').then(() => props.history('/'))
  }

  return (
    <div className='group fixed left-0 top-0 bottom-0 w-max rounded-e-3xl bg-neutral-800 shadow-lg overflow-hidden z-50'>
      <div className='relative w-14 group-hover:w-60 h-full p-4 bg-neutral-900/85 overflow-hidden whitespace-nowrap transition-all'>
        <div className='flex flex-col w-52 h-12 text-lg font-medium tracking-widest'>
          <div className='flex items-center gap-4 mb-3'>
            <FontAwesomeIcon icon={faBars} className='w-6' />
            <div className='opacity-0 group-hover:opacity-100 transition-opacity'>TIER LIST</div>
          </div>
          <div className='w-6 group-hover:w-52 h-0.5 bg-blue-500 transition-all'></div>
        </div>

        <div className='top-16 flex flex-col gap-2 w-52 my-8'>
          <NavItem text={'Főoldal'} icon={faHome} pathname={'/'} />
          <NavItem text={'Profile'} icon={faUser} pathname={'/profile'} />
          <NavItem text={'Listák'} icon={faList} pathname={'/list'} />
        </div>

        <div className={`flex flex-col gap-0.5 w-52 py-2 rounded-xl bg-neutral-900 overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity`}>
          <ListItem name={'List 1'} status={2} />
          <ListItem name={'List 2'} status={1} />
          <ListItem name={'List 3'} status={3} />
          <ListItem name={'List 4'} status={2} />
          <ListItem name={'List 5'} status={3} />
        </div>

        <button onClick={Logout} className='absolute left-5 bottom-5 flex items-center text-red-500 hover:text-red-400 transition-all'>
          <FontAwesomeIcon icon={faRightFromBracket} className='mr-3' />
          <div className='text-xl opacity-0 group-hover:opacity-100 transition-opacity'>Kijelentkezés</div>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
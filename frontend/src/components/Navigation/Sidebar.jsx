import { useEffect, useState } from 'react'
import axios from 'axios'
import { logout } from '../../user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faHome, faUser, faList, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import NavItem from './sidebar/NavItem'
import ListItem from './sidebar/ListItem'

export default function Sidebar({ logged, history, loading }) {
  const [lists, setLists] = useState([])

  // Sidebar listák lekérése
  const getLists = async () => {
    const { data } = await axios.get('/lists/sidebar')
    setLists(data)
  }

  useEffect(() => {
    if (logged && !loading) getLists().catch(err => console.log(err))
  }, [logged, loading])

  return (
    <div className='group fixed left-0 top-0 bottom-0 w-14 hover:w-60 p-4 rounded-e-3xl shadow-lg bg-neutral-900/85 backdrop-blur overflow-hidden z-50 hidden sm:inline whitespace-nowrap transition-[width]'>
      <div className='flex flex-col w-52 h-12 text-lg font-medium tracking-widest'>
        <div className='flex items-center gap-4 mb-3'>
          <FontAwesomeIcon icon={faBars} className='w-6' />
          <div className='opacity-0 group-hover:opacity-100 transition-opacity'>TIER LIST</div>
        </div>
        <div className='w-6 group-hover:w-52 h-0.5 bg-blue-500 transition-all'></div>
      </div>

      <div className='top-16 flex flex-col gap-2 w-52 my-8'>
        <NavItem text={'Főoldal'} icon={faHome} pathname={'/'} />
        <NavItem text={'Profil'} icon={faUser} pathname={'/profile'} disabled={!logged} />
        <NavItem text={'Listák'} icon={faList} pathname={'/list'} disabled={!logged} />
      </div>

      {lists && lists.length > 0 ?
        <div className='flex flex-col gap-0.5 w-52 py-2 rounded-xl bg-neutral-900 overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity'>
          {lists.map(list => <ListItem key={list.id} list={list} history={history} />)}
        </div>
      : <></>}

      <button onClick={logged ? () => logout({ redirect: '/', history }) : () => history(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)} className={`absolute left-5 bottom-5 flex items-center ${logged ? 'text-red-500 hover:text-red-400' : 'text-emerald-500 hover:text-emerald-400'} transition-all`}>
        <FontAwesomeIcon icon={logged ? faRightFromBracket : faRightToBracket} className='mr-3' />
        <div className='text-xl opacity-0 group-hover:opacity-100 transition-opacity'>{logged ? 'Kijelentkezés' : 'Bejelentkezés'}</div>
      </button>
    </div>
  )
}
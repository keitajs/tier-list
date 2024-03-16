import React from 'react'
import axios from 'axios'
import { socket } from '../../socket'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import 'moment/locale/hu'

function UserData(props) {
  const Logout = () => {
    socket.disconnect()
    axios.delete('http://localhost:2000/logout').then(() => props.history('/'))
  }

  return (
    <div className='flex flex-col justify-between lg:grow px-4 rounded-3xl bg-neutral-900/85'>
      <div className='flex items-center justify-center gap-2 py-3 border-b-2 border-blue-500 text-3xl'>
        {props?.user?.username ? props.user.username : 'Betöltés...'}
        <FontAwesomeIcon icon={faEdit} onClick={() => props.setEdit('username')} className='cursor-pointer absolute right-7 h-4 opacity-25 hover:opacity-50 transition-opacity' />
      </div>
      
      <div className='flex flex-col gap-1.5 my-3 2xl:text-lg text-base grow'>
        <div className='flex flex-wrap items-center justify-between'>
          Státusz
          <div className='flex items-center gap-2'>
            <div className={`h-2.5 aspect-square rounded-full ${props.user.status === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            {props.user.status === 1 ? 'Online' : 'Offline'}
          </div>
        </div>
        <div className='flex flex-wrap items-center justify-between'>
          <p className='flex items-center gap-2'>
            Email
            <FontAwesomeIcon icon={faEdit} onClick={() => props.setEdit('email')} className='cursor-pointer h-3.5 opacity-25 hover:opacity-50 transition-opacity' />
          </p>
          <p className={`text-right ${props.params ? 'blur-sm overflow-hidden select-none' : ''}`}>{props.user.email}</p>
        </div>
        <div className='flex flex-wrap items-center justify-between'>Listák <p><span className='text-blue-400'>{props?.list?.count | 0}</span> db</p></div>
        <div className='flex flex-wrap items-center justify-between ml-4 -mt-1.5'>
          Folyamatban
          <p className='text-right'><span className='text-blue-400'>{props?.list[0] | 0}</span> db</p>
        </div>
        <div className='flex flex-wrap items-center justify-between ml-4 -mt-1.5'>
          Kész
          <p className='text-right'><span className='text-emerald-400'>{props?.list[1] | 0}</span> db</p>
        </div>
        <div className='flex flex-wrap items-center justify-between ml-4 -mt-1.5'>
          Dobott
          <p className='text-right'><span className='text-rose-400'>{props?.list[2] | 0}</span> db</p>
        </div>
        <div className='flex flex-wrap items-center justify-between'>Kategóriák <p className='text-right'><span className='text-blue-400'>{props?.list?.categories?.count | 0}</span> db</p></div>
        <div className='flex flex-wrap items-center justify-between'>Karakterek <p className='text-right'><span className='text-blue-400'>{props?.list?.characters?.count | 0}</span> db</p></div>
        <div className='flex flex-wrap items-center justify-between'>Regisztráció ideje <p className='text-right'>{moment(props.user.registerDate).locale('hu').format('L LTS')}</p></div>
      </div>

      <div className='relative flex flex-col gap-2 mb-4'>
        <button onClick={() => props.setEdit('password')} className='py-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors'>Jelszó módosítás</button>
        <button onClick={Logout} className='py-1 rounded-lg bg-rose-700 hover:bg-rose-600 transition-colors'>Kijelentkezés</button>
      </div>
    </div>
  )
}

export default UserData
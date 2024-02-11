import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import UserData from '../components/Profile/UserData'
import Activity from '../components/Profile/Activity'
import Characters from '../components/Profile/Characters'
import Lists from '../components/Profile/Lists'
import Username from '../components/Profile/Edit/Username'
import Avatar from '../components/Profile/Edit/Avatar'
import Email from '../components/Profile/Edit/Email'
import Password from '../components/Profile/Edit/Password'

function Profile(props) {
  const [user, setUser] = useState({})
  const [list, setList] = useState({})
  const [weeklyActivies, setWeeklyActivies] = useState([])

  const [edit, setEdit] = useState(null)

  const getUserData = async () => {
    const { data } = await axios.get('http://localhost:2000/user/data')
    setUser(data.user)
    setWeeklyActivies(data.weeklyActivies)
    setList(data.list)
  }

  useEffect(() => {
    getUserData().catch(err => props.history('/'))
  }, [props])

  return (
    <div className='min-h-screen p-6'>
      <Sidebar history={props.history} />

      <div className='h-full ml-14'>
        <div className='flex flex-col gap-6 fixed right-6 top-6 bottom-6 w-1/5'>
          <div className='group relative aspect-square rounded-3xl bg-neutral-900/85 overflow-hidden'>
            <img src={`http://localhost:2000/user/images/${user.avatar}`} alt="" className='w-full h-full object-cover' />
            <div onClick={() => setEdit('avatar')} className='cursor-pointer absolute bottom-0 left-0 right-0 py-3 text-lg text-center bg-neutral-950 opacity-0 group-hover:opacity-35 hover:!opacity-90 transition-opacity'>Profilkép módosítás</div>
          </div>
          <div className='px-4 grow rounded-3xl bg-neutral-900/85'>
            <UserData user={user} list={list} setEdit={setEdit} history={props.history} />
          </div>
        </div>
        <div className='flex flex-col gap-3 w-4/5 pr-12'>
          <Activity weeklyActivies={weeklyActivies} />
          <Characters characters={list?.characters?.mostUsed || []} />
          <Lists lists={list?.mostUpdated || []} history={props.history} />
        </div>
      </div>

      <Username hide={edit !== 'username'} user={user} setUser={setUser} setEdit={setEdit} />
      <Avatar hide={edit !== 'avatar'} setUser={setUser} setEdit={setEdit} />
      <Email hide={edit !== 'email'} user={user} setUser={setUser} setEdit={setEdit} />
      <Password hide={edit !== 'password'} setEdit={setEdit} />
    </div>
  )
}

export default Profile
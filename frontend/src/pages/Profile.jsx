import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { refreshToken } from '../user'
import Navigation from '../components/navigation/Navigation'
import UserData from '../components/Profile/UserData'
import Activity from '../components/Profile/Activity'
import Characters from '../components/Profile/Characters'
import Lists from '../components/Profile/Lists'
import Username from '../components/Profile/Edit/Username'
import Avatar from '../components/Profile/Edit/Avatar'
import Email from '../components/Profile/Edit/Email'
import Password from '../components/Profile/Edit/Password'
import Box from '../components/ui/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

function Profile({ history }) {
  const params = useParams()
  const [hasUser, setHasUser] = useState(!!params.username)
  const [user, setUser] = useState({})
  const [list, setList] = useState({})
  const [weeklyActivies, setWeeklyActivies] = useState([])
  const [edit, setEdit] = useState(null)

  // Felhasználói adatok lekérése
  const getUserData = async () => {
    const { username } = params
    setHasUser(!!params.username)

    const logged = await refreshToken()
    if (!logged && !params.username) return history('/', { replace: true })

    const { data } = await axios.get(`/user/data${username ? `/${username}` : ''}`)
    if (data.error && params.username) return history('/profile', { replace: true })
    if (data.error && !params.username) return history('/', { replace: true })

    setUser(data.user)
    setWeeklyActivies(data.weeklyActivies)
    setList(data.list)

    document.title = `${data.user.username} - Felhasználók | Tier List`
  }

  useEffect(() => {
    getUserData().catch(err => console.error(err))
  }, [params])

  return (
    <div className='min-h-screen p-6'>
      <Navigation history={history} loading={!user.username} />

      <div className='flex flex-col-reverse md:flex-row gap-6 h-full ml-0 sm:ml-14 mb-16 sm:mb-0'>
        <div className='flex flex-wrap gap-6 w-full md:w-1/2 xl:w-2/3 *:!w-1/2 *:xl:!w-1/3 *:!h-auto *:aspect-video *:grow'>
          <Box>
            {/* <Activity weeklyActivies={weeklyActivies} /> */}
          </Box>
          <Box>
            {/* <Characters characters={list?.characters?.mostUsed || []} /> */}
          </Box>
          <Box>
            {/* <Lists lists={list?.mostUpdated || []} params={hasUser} history={history} /> */}
          </Box>
          <Box></Box>
          <Box></Box>
          <Box></Box>
        </div>
        <div className='w-full md:w-1/2 xl:w-1/3'>
          <Box className='group !relative !flex !flex-row !gap-3 !p-2.5'>
            <button
              onClick={!hasUser ? () => setEdit('avatar') : undefined}
              className={`flex items-center justify-center w-36 h-36 rounded-2xl overflow-hidden border-2 border-transparent ${!hasUser ? 'hover:border-neutral-600' : 'cursor-default'} transition-colors`}
            >
              {user.avatar ?
                <img
                  src={`${axios.defaults.baseURL}/user/images/${user.avatar}?autoRefresh=true&refreshKey=${Math.floor(Math.random() * 10**8)}`}
                  alt="Profilkép"
                  className='w-full h-full object-cover'
                />
              :
                <div className='w-1/4 h-1/4 rounded-full border-e-4 border-neutral-700/50 animate-spin'></div>
              }
            </button>
            <div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-2 text-2xl'>
                  {user.username}
                  {!hasUser &&
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => setEdit('username')}
                      className='cursor-pointer h-3.5 opacity-0 group-hover:opacity-25 hover:!opacity-65 transition-opacity'
                    />
                  }
                </div>
                <div className='text-sm opacity-50'>Admin</div>
              </div>
            </div>
            <div className={`absolute right-5 top-5 w-3 h-3 rounded-full ${user.status === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          </Box>
        </div>
      </div>

      {/* <div className='h-full ml-0 sm:ml-14 mb-16 sm:mb-0'>
        <div className='flex flex-col gap-6 relative lg:fixed lg:right-6 lg:top-6 lg:bottom-6 w-full lg:w-1/5 mb-3 lg:mb-0'>
          <div className='flex items-center justify-center group relative max-w-96 w-full mx-auto aspect-square rounded-3xl bg-neutral-900/85 overflow-hidden'>
            {user.avatar ? <img src={`${axios.defaults.baseURL}/user/images/${user.avatar}?autoRefresh=true&refreshKey=${Math.floor(Math.random() * 10**8)}`} alt="" className='w-full h-full object-cover' /> : <div className='w-1/4 h-1/4 rounded-full border-e-4 border-neutral-700/50 animate-spin'></div>}
            {hasUser ? <></> : <div onClick={() => setEdit('avatar')} className='cursor-pointer absolute bottom-0 left-0 right-0 py-3 text-lg text-center bg-neutral-950 opacity-0 group-hover:opacity-35 hover:!opacity-90 transition-opacity'>Profilkép módosítás</div>}
          </div>
          <UserData user={user} list={list} setEdit={setEdit} params={hasUser} history={history} />
        </div>
        <div className='flex flex-col gap-3 w-full lg:w-4/5 pr-0 lg:pr-12'>
          <Activity weeklyActivies={weeklyActivies} />
          <Characters characters={list?.characters?.mostUsed || []} />
          <Lists lists={list?.mostUpdated || []} params={hasUser} history={history} />
        </div>
      </div> */}

      <Username hide={edit !== 'username'} currentUsername={user.username} setUser={setUser} setEdit={setEdit} />
      <Email hide={edit !== 'email'} currentEmail={user.email} setUser={setUser} setEdit={setEdit} />
      <Avatar hide={edit !== 'avatar'} avatar={user.avatar} setUser={setUser} setEdit={setEdit} />
      <Password hide={edit !== 'password'} setEdit={setEdit} />
    </div>
  )
}

export default Profile
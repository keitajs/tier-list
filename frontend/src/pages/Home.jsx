import React, { useEffect, useState } from 'react'
import { refreshToken } from '../user'
import Index from '../components/Home/Index'
import Login from '../components/Home/Login'
import Register from '../components/Home/Register'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

function Home(props) {
  const [active, setActive] = useState(props.active)
  const [logged, setLogged] = useState(false)
  
  // Bejelentkezési állapot lekérése
  const getLogged = async () => {
    setLogged(await refreshToken())
  }

  useEffect(() => {
    getLogged()
  }, [])

  useEffect(() => {
    // Oldal cím beállítása
    if (logged) setActive(0)

    if (logged || active <= 0) {
      document.title = 'Tier List'
      props.history('/', { replace: false })
    }
    else if (active === 1) {
      document.title = 'Bejelentkezés | Tier List'
      props.history('/login', { replace: false })
    }
    else if (active === 2) {
      document.title = 'Regisztráció | Tier List'
      props.history('/register', { replace: false })
    }
  }, [active, logged])

  return (
    <div className='w-screen h-screen flex flex-col lg:flex-row overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-bl from-neutral-800 via-neutral-800 to-blue-500 opacity-20'></div>
      <div className='relative w-full lg:w-1/2 h-max lg:h-screen mt-8 lg:mt-0 flex flex-col items-center justify-center'>
        <h1 className='w-3/4 text-5xl sm:text-7xl xl:text-8xl text-center lg:text-left font-bold tracking-wider'>TIER LIST</h1>
        <p className='w-3/4 ml-0 lg:ml-6 xl:ml-9 mt-1 xl:mt-2 text-sm sm:text-lg xl:text-xl text-center lg:text-left'>Készítsd el te is a saját Anime Tier Listedet!</p>

        <div className={`hidden lg:flex flex-col mt-5 ${active <= 0 ? 'opacity-0 pointer-events-none select-none translate-y-4' : ''} transition-all`}>
          <div className='flex items-center mb-1 ml-auto'>
            <button onClick={() => setActive(-active)} className='flex items-center'><FontAwesomeIcon icon={faHome} className='mr-4 h-6 opacity-60 hover:opacity-75 transition-opacity' /></button>
            <button onClick={() => setActive(active === 1 ? 2 : 1)} className='w-max px-8 py-1.5 text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>{Math.abs(active) === 1 ? 'Regisztráció' : 'Bejelentkezés'}</button>
          </div>
          <button onClick={() => setActive(active === 1 ? 2 : 1)} className='ml-auto text-sm opacity-60 hover:opacity-75 transition-opacity'>{Math.abs(active) === 1 ? 'Még nincs felhasználód? Regisztrálj most!' : 'Már van felhasználód? Jelentkezz be itt.'}</button>
        </div>
      </div>
      <div className='relative w-full lg:w-1/2 h-full lg:h-screen flex items-center justify-center'>
        <Index active={active <= 0} setActive={setActive} history={props.history} logged={logged} />
        <Login active={active === 1} setActive={setActive} history={props.history} />
        <Register active={active === 2} setActive={setActive} />
      </div>
    </div>
  )
}

export default Home
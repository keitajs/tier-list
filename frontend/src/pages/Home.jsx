import React, { useState } from 'react'
import Index from '../components/Home/Index'
import Login from '../components/Home/Login'
import Register from '../components/Home/Register'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

function Home(props) {
  const [active, setActive] = useState(0)

  return (
    <div className='w-screen h-screen flex overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-bl from-neutral-800 via-neutral-800 to-blue-500 opacity-20'></div>
      <div className='relative w-1/2 h-screen flex flex-col items-center justify-center'>
        <h1 className='w-3/4 text-8xl font-bold tracking-wider'>TIER LIST</h1>
        <p className='w-3/4 ml-9 mt-2 text-xl'>Készítsd el te is a saját Anime Tier Listedet!</p>

        <div className={`flex flex-col mt-5 ${active <= 0 ? 'opacity-0 pointer-events-none translate-y-4' : ''} transition-all`}>
          <div className='flex items-center mb-1 ml-auto'>
            <button onClick={() => setActive(-active)} className='flex items-center'><FontAwesomeIcon icon={faHome} className='mr-4 h-6 opacity-60 hover:opacity-75 transition-opacity' /></button>
            <button onClick={() => setActive(active === 1 ? 2 : 1)} className='w-max px-8 py-1.5 text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>{Math.abs(active) === 1 ? 'Regisztráció' : 'Bejelentkezés'}</button>
          </div>
          <button onClick={() => setActive(active === 1 ? 2 : 1)} className='ml-auto text-sm opacity-60 hover:opacity-75 transition-opacity'>{Math.abs(active) === 1 ? 'Még nincs felhasználód? Regisztrálj most!' : 'Már van felhasználód? Jelentkezz be itt.'}</button>
        </div>
      </div>
      <div className='relative w-1/2 h-screen flex items-center justify-center'>
        <Index active={active <= 0} setActive={setActive} />
        <Login active={active === 1} setActive={setActive} />
        <Register active={active === 2} setActive={setActive} />
      </div>
    </div>
  )
}

export default Home
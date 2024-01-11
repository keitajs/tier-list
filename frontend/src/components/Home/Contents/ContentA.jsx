import React from 'react'
import { Link } from 'react-router-dom'

function ContentA(props) {
  return (
    <div className={`absolute flex flex-col mx-6 ${props.selected ? 'transition-all' : `pointer-events-none opacity-0 ${props.animation === 0 ? 'translate-x-32' : '-translate-x-32'}`}`}>
      <h2 className='relative text-3xl font-semibold w-max mb-5 pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-2/5 after:h-0.5 after:rounded-lg after:bg-blue-500'>Lista készítés egyszerűen!</h2>
      <p className='my-1 leading-5 text-lg'>Az oldal sokféle lehetőséget nyújt a gyors és egyszerű Tier List készítéshez!</p>
      <p className='my-1 leading-5 text-lg'>A <Link to={'https://myanimelist.net'} target='_blank' className='text-blue-200 hover:text-blue-100 transition-colors'>MyAnimeList</Link> oldalán található összes karaktert azonnal elérheted és felhasználhatod a listádban, csak a név vagy az URL szükséges a beazonosításához!</p>
      
      <button onClick={() => props.setActive(2)} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Regisztráció</button>
      <button onClick={() => props.setActive(1)} className='ml-auto text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
    </div>
  )
}

export default ContentA
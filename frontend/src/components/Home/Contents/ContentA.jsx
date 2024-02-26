import React from 'react'
import { Link } from 'react-router-dom'

function ContentA(props) {
  return (
    <div className={`absolute flex flex-col mx-6 ${props.left ? 'translate-x-[60%]' : props.right ? '-translate-x-[60%]' : ''} transition-all ${!props.center ? 'scale-50 opacity-0 pointer-events-none select-none' : ''}`}>
      <h2 className='relative text-xl lg:text-3xl font-semibold w-max mb-5 pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-2/5 after:h-0.5 after:rounded-lg after:bg-blue-500'>Lista készítés egyszerűen!</h2>
      <p className='my-1 leading-5 text-base lg:text-lg'>Az oldal sokféle lehetőséget nyújt a gyors és egyszerű Tier List készítéshez!</p>
      <p className='my-1 leading-5 text-base lg:text-lg'>A <Link to={'https://myanimelist.net'} target='_blank' className='text-blue-200 hover:text-blue-100 transition-colors'>MyAnimeList</Link> oldalán található összes karaktert azonnal elérheted és felhasználhatod a listádban, csak a név vagy az URL szükséges a beazonosításához!</p>
      
      {props.logged ?
      <button onClick={() => props.history('/list')} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-base lg:text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Listák</button>
      : <>
      <button onClick={() => props.setActive(2)} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-base lg:text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Regisztráció</button>
      <button onClick={() => props.setActive(1)} className='ml-auto text-xs lg:text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
      </>}
    </div>
  )
}

export default ContentA
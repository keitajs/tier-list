import React from 'react'

function ContentB(props) {
  return (
    <div className={`absolute flex flex-col mx-6 ${props.left ? 'translate-x-[60%]' : props.right ? '-translate-x-[60%]' : ''} transition-all ${!props.center ? 'scale-50 opacity-0 pointer-events-none select-none' : ''}`}>
      <h2 className='relative text-3xl font-semibold w-max mb-5 pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-2/5 after:h-0.5 after:rounded-lg after:bg-blue-500'>Készíts listát barátaiddal!</h2>
      <p className='my-1 leading-5 text-lg'>A listák beállításaiban jogosultságokat adhatsz barátaidnak, amivel engedélyezheted számukra a megtekintését vagy akár a közös szerkesztését is!</p>
      <p className='my-1 leading-5 text-lg'>Azonnal láthatod a mások által végrehajtott újításokat, ezzel hatékonyabbá téve a csapatmunkát!</p>
      
      {props.logged ?
      <button onClick={() => props.history('/list')} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Listák</button>
      : <>
      <button onClick={() => props.setActive(2)} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Regisztráció</button>
      <button onClick={() => props.setActive(1)} className='ml-auto text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
      </>}
    </div>
  )
}

export default ContentB
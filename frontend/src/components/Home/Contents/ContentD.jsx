import React, { useEffect, useState, useRef } from 'react'

function ContentD(props) {
  const ref = useRef(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!props.center) return

    const t = ref.current.textContent.length * 50
    const timeout = setTimeout(props.nextPage, t)
    setTime(t)
    return () => clearTimeout(timeout)
  }, [props])

  return (
    <div ref={ref} className={`absolute flex flex-col mx-6 ${props.left ? 'translate-x-[60%]' : props.right ? '-translate-x-[60%]' : ''} transition-all ${!props.center ? 'scale-50 opacity-0 pointer-events-none select-none' : ''}`}>
      <h2 className={`relative text-xl lg:text-3xl font-semibold w-max mb-5 pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:rounded-lg after:bg-blue-500 ${props.center ? 'home-content-anim' : ''}`} style={{"--time": `${time}ms`}}>Profil statisztikák</h2>
      <p className='my-1 leading-5 text-base lg:text-lg'>A profil oldalon láthatod a heti aktivitásodat, a legtöbbet használt karakterjeidet és listáidat!</p>
      <p className='my-1 leading-5 text-base lg:text-lg'>Készíts listákat, hogy még szebb grafikonok készülhessenek!</p>
      
      {props.logged ?
      <button onClick={() => props.history('/profile')} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-base lg:text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Profil</button>
      : <>
      <button onClick={() => props.setActive(2)} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-base lg:text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Regisztráció</button>
      <button onClick={() => props.setActive(1)} className='ml-auto text-xs lg:text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
      </>}
    </div>
  )
}

export default ContentD
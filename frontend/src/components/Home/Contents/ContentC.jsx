import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

function ContentC(props) {
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
      <h2 className={`relative text-xl lg:text-3xl font-semibold w-max mb-5 pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:rounded-lg after:bg-blue-500 ${props.center ? 'home-content-anim' : ''}`} style={{"--time": `${time}ms`}}>MyAnimeList API</h2>
      <p className='my-1 leading-5 text-base lg:text-lg'>Egyszerűen és gyorsan használhatod a MyAnimeList által biztosított adatokat, ezáltal nem kell foglalkozni az adatok, képek keresésével, mivel azonnal elérhetőek!</p>
      <p className='my-1 leading-5 text-base lg:text-lg'>Az oldal a Jikan API-t használja az adatok lekérésére, ez egy bárki számára elérhető, Unofficial MyAnimeList API. További információkért kattints a gombra!</p>
      
      <Link to={'https://jikan.moe'} target='_blank' className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-base lg:text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Jikan API</Link>
    </div>
  )
}

export default ContentC
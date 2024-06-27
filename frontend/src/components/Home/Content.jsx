import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export function Content({ title, paragraphs, link, center, left, right, logged, nextPage, setActive }) {
  const ref = useRef(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!center) return

    const t = ref.current.textContent.length * 50
    const timeout = setTimeout(nextPage, t)
    setTime(t)
    return () => clearTimeout(timeout)
  }, [center])

  return (
    <div ref={ref} className={`absolute flex flex-col mx-6 ${left ? 'translate-x-[60%]' : right ? '-translate-x-[60%]' : ''} transition-all ${!center ? 'scale-50 opacity-0 pointer-events-none select-none' : ''}`}>
      <h2
        className={`relative text-xl lg:text-3xl font-semibold w-max mb-5 pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:rounded-lg after:bg-blue-500 ${center ? 'after:animate-width-load' : ''}`}
        style={{"--time": `${time}ms`}}
      >
        {title}
      </h2>

      {paragraphs.map((p, i) => <p key={i} className='my-1 leading-5 text-base lg:text-lg'>{p}</p>)}

      {logged ?
        <Button href={link.href} target={link.target} width='max' className='mt-4 mb-1 ml-auto text-base lg:text-lg'>{link.text}</Button>
      : <>
        <Button onClick={() => setActive(2)} width='max' className='mt-4 mb-1 ml-auto text-base lg:text-lg'>Regisztráció</Button>
        <button onClick={() => setActive(1)} className='ml-auto text-xs lg:text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
      </>}
    </div>
  )
}

export const Contents = [
  {
    title: <>Lista készítés egyszerűen!</>,
    paragraphs: [
      <>Az oldal sokféle lehetőséget nyújt a gyors és egyszerű Tier List készítéshez!</>,
      <>A <Link to={'https://myanimelist.net'} target='_blank' className='text-blue-200 hover:text-blue-100 transition-colors'>MyAnimeList</Link> oldalán található összes karaktert azonnal elérheted és felhasználhatod a listádban, csak a név szükséges a beazonosításához!</>
    ],
    link: {
      href: '/list',
      text: 'Listák'
    }
  },
  {
    title: <>Készíts listát barátaiddal!</>,
    paragraphs: [
      <>A listák beállításaiban jogosultságokat adhatsz barátaidnak, amivel engedélyezheted számukra a megtekintését vagy akár a közös szerkesztését is!</>,
      <>Azonnal láthatod a mások által végrehajtott újításokat, ezzel hatékonyabbá téve a csapatmunkát!</>
    ],
    link: {
      href: '/list',
      text: 'Listák'
    }
  },
  {
    title: <>MyAnimeList API</>,
    paragraphs: [
      <>Egyszerűen és gyorsan használhatod a MyAnimeList által biztosított adatokat, ezáltal nem kell foglalkozni az adatok, képek keresésével, mivel azonnal elérhetőek!</>,
      <>Az oldal a Jikan API-t használja az adatok lekérésére, ez egy bárki számára elérhető, Unofficial MyAnimeList API. További információkért kattints a gombra!</>
    ],
    link: {
      href: 'https://jikan.moe',
      text: 'Jikan API',
      target: '_blank'
    }
  },
  {
    title: <>Profil statisztikák</>,
    paragraphs: [
      <>A profil oldalon láthatod a heti aktivitásodat, a legtöbbet használt karakterjeidet és listáidat!</>,
      <>Készíts listákat, hogy még szebb grafikonok készülhessenek!</>
    ],
    link: {
      href: '/profile',
      text: 'Profil'
    }
  }
]
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faClose } from '@fortawesome/free-solid-svg-icons'

function Characters(props) {
  const [full, setFull] = useState(null)
  const [zoom, setZoom] = useState(false)
  const maxCount = useMemo(() => Math.max(...props.characters.map((character) => character.count)), [props.characters])

  useEffect(() => {
    setZoom(false)
  }, [full])

  return (
    <div className='p-5 rounded-3xl bg-neutral-900/85'>
      <div className='flex items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>Leggyakrabban használt karakterek</div>
      <div className='flex flex-col gap-2 mt-2'>
        {props.characters.map(character =>
          <div key={character.id} className='flex'>
            <div onClick={() => setFull(null)} className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${full === character.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity`}>
              <div onClick={(e) => {e.stopPropagation(); setZoom(!zoom)}} className={`${zoom ? 'h-full cursor-zoom-out' : 'h-1/2 cursor-zoom-in'} aspect-[3/4] rounded-2xl overflow-hidden transition-all ${full === character.id ? 'scale-100' : 'scale-0'}`}>
                <img src={character.image.startsWith('http') ? character.image : `http://localhost:2000/characters/images/${character.image}`} alt="" className='w-full h-full object-cover' />
              </div>
              <button onClick={() => setFull(null)} className='absolute top-4 right-6 opacity-25 hover:opacity-100 transition-opacity'><FontAwesomeIcon icon={faClose} className='h-8' /></button>
            </div>

            <button onClick={() => setFull(character.id)} className='h-32 aspect-[3/4] rounded-2xl overflow-hidden'>
              <img src={character.image.startsWith('http') ? character.image : `http://localhost:2000/characters/images/${character.image}`} alt="" className='w-full h-full object-cover' />
            </button>
            <div className='flex flex-col w-full justify-center'>
              <Link to={character.url} target='_blank' className='group flex items-center gap-1.5 text-xl leading-6 w-max ml-2'>
                {character.name}
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='h-2.5 opacity-0 group-hover:opacity-50 -translate-x-3 group-hover:translate-x-0 transition-all' />
              </Link>
              <Link to={character.anime.url} target='_blank' className='group flex items-center gap-1.5 w-max ml-2 mb-2 opacity-50 hover:opacity-75 transition-opacity'>
                {character.anime.title}
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='h-2.5 opacity-0 group-hover:opacity-50 -translate-x-3 group-hover:translate-x-0 transition-all' />
              </Link>
              <div className='w-[95%]'>
                <div className='relative h-8 rounded-e-xl bg-blue-500' style={{width: `${character.count/maxCount*100}%`}}>
                  <div className='absolute -right-5'>{character.count}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Characters
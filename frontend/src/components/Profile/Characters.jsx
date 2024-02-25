import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faPlus, faMinus, faClose } from '@fortawesome/free-solid-svg-icons'

function Characters(props) {
  const [full, setFull] = useState(null)
  const [zoom, setZoom] = useState(0.5)
  const maxCount = useMemo(() => Math.max(...props.characters.map((character) => character.count)), [props.characters])

  const zoomIn = () => setZoom(zoom => zoom + 0.05 <= 1.25 ? zoom + 0.05 : 1.25)
  const zoomOut = () => setZoom(zoom => zoom - 0.05 >= 0.25 ? zoom - 0.05 : 0.25)

  const zoomScroll = (e) => {
    if (e.deltaY < 0) return zoomIn()
    zoomOut()
  }

  const zoomClick = (e) => {
    e.stopPropagation()
    setZoom(zoom => {
      if (zoom > 0.5) return 0.5
      return 1
    })
  }

  const preventScroll = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  useEffect(() => {
    if (!full) return setZoom(0.5)

    window.addEventListener('wheel', preventScroll, { passive: false })
    return () => window.removeEventListener('wheel', preventScroll, { passive: false })
  }, [full])  

  return (
    <div className='p-5 rounded-3xl bg-neutral-900/85'>
      <div className='flex items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>Leggyakrabban használt karakterek</div>
      {props?.characters.length > 0 ?
        <div className='flex flex-col gap-2 mt-2'>
          {props.characters.map(character =>
            <div key={character.id} className='flex'>
              <div onClick={() => setFull(null)} onWheel={zoomScroll} className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${full === character.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity`}>
                <div style={{height: `${zoom*100}%`}} onClick={zoomClick} className={`${zoom > 0.5 ? 'cursor-zoom-out' : 'cursor-zoom-in'} aspect-[3/4] rounded-2xl overflow-hidden transition-all ${full === character.id ? 'scale-100' : 'scale-0'}`}>
                  <img src={character.image.startsWith('http') ? character.image : `http://localhost:2000/characters/images/${character.image}`} alt="" className='w-full h-full object-cover' />
                </div>
                <button onClick={() => setFull(null)} className='absolute top-4 right-5 opacity-25 hover:opacity-100 transition-opacity'><FontAwesomeIcon icon={faClose} className='h-8' /></button>
                <div className='absolute bottom-4 right-5 flex flex-col rounded-lg bg-neutral-700/50'>
                  <button onClick={e => {e.stopPropagation(); zoomIn()}} className='w-10 h-10 rounded-lg hover:bg-neutral-700 transition-all'><FontAwesomeIcon icon={faPlus} /></button>
                  <button onClick={e => {e.stopPropagation(); zoomOut()}} className='w-10 h-10 rounded-lg hover:bg-neutral-700 transition-all'><FontAwesomeIcon icon={faMinus} /></button>
                </div>
              </div>

              <button onClick={() => setFull(character.id)} className='h-32 w-24 rounded-2xl overflow-hidden'>
                <img src={character.image.startsWith('http') ? character.image : `http://localhost:2000/characters/images/${character.image}`} alt="" className='w-full h-full object-cover' />
              </button>
              <div className='flex flex-col justify-center grow w-1/2'>
                <Link to={character.url} target='_blank' className='group truncate flex items-center gap-1.5 text-xl leading-6 w-full lg:w-max ml-2'>
                  {character.name}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='hidden lg:inline h-2.5 opacity-0 group-hover:opacity-50 -translate-x-3 group-hover:translate-x-0 transition-all' />
                </Link>
                <Link to={character.anime.url} target='_blank' className='group truncate flex items-center gap-1.5 w-full lg:w-max ml-2 mb-2 opacity-50 hover:opacity-75 transition-opacity'>
                  {character.anime.title}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='hidden lg:inline h-2.5 opacity-0 group-hover:opacity-50 -translate-x-3 group-hover:translate-x-0 transition-all' />
                </Link>
                <div className='w-[95%]'>
                  <div className='relative h-6 lg:h-8 rounded-e-md lg:rounded-e-xl bg-blue-500' style={{width: `${character.count/maxCount*100}%`}}>
                    <div className='absolute -right-5'>{character.count}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      : <div className='flex items-center justify-center h-20 pt-4 opacity-50'>Nincs betölthető karakter</div>}
      
    </div>
  )
}

export default Characters
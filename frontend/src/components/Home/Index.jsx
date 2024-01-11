import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import ContentA from './Contents/ContentA'
import ContentB from './Contents/ContentB'

function Home(props) {
  const [selected, setSelected] = useState({ content: 0, animation: 0 })

  return (
    <div className={`absolute flex w-full mr-12 ${props.active ? '' : 'opacity-0 pointer-events-none translate-y-4'} transition-all`}>
      <div className='flex flex-col justify-center'><FontAwesomeIcon icon={faChevronLeft} onClick={() => setSelected({ content: selected.content === 0 ? 1 : selected.content - 1, animation: 0 })} className='cursor-pointer h-8 p-4 opacity-75 hover:opacity-100 transition-opacity' /></div>
      
      <div className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
        <ContentA selected={selected.content === 0} animation={selected.animation} setActive={props.setActive} />
        <ContentB selected={selected.content === 1} animation={selected.animation} setActive={props.setActive} />
      </div>
      
      <div className='flex flex-col justify-center'><FontAwesomeIcon icon={faChevronRight} onClick={() => setSelected({ content: selected.content === 1 ? 0 : selected.content + 1, animation: 1 })} className='cursor-pointer h-8 p-4 opacity-75 hover:opacity-100 transition-opacity' /></div>
    </div>
  )
}

export default Home
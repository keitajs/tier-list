import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import ContentA from './Contents/ContentA'
import ContentB from './Contents/ContentB'
import ContentC from './Contents/ContentC'

function Home(props) {
  const [contentIds, setContentIds] = useState([0, 1, 2])
  const [contents] = useState([ContentA, ContentB, ContentC])
  
  // Contentek közötti lapozás
  const nextPage = () => setContentIds([cIndex(contentIds[0] + 1), cIndex(contentIds[1] + 1), cIndex(contentIds[2] + 1)])
  const previousPage = () => setContentIds([cIndex(contentIds[0] - 1), cIndex(contentIds[1] - 1), cIndex(contentIds[2] - 1)])
  
  // Ha az index - 1 vagy index + 1 egy nem létező content id-t kap, akkor visszaadja a sor másik végén lévőt
  const cIndex = (index) => {
    return index < 0 ? contents.length - 1 : index === contents.length ? 0 : index
  }

  return (
    <div className={`absolute flex w-full mr-12 ${props.active ? '' : 'opacity-0 pointer-events-none select-none translate-y-4'} transition-all`}>
      <div className='flex flex-col justify-center select-none'><FontAwesomeIcon icon={faChevronLeft} onClick={previousPage} className='cursor-pointer h-8 p-4 opacity-75 hover:opacity-100 transition-opacity' /></div>
      
      <div className='relative w-full h-screen flex items-center justify-center'>
        { contents.map((Content, i) => <Content key={i} logged={props.logged} history={props.history} left={i === contentIds[0]} center={i === contentIds[1]} right={i === contentIds[2]} setActive={props.setActive} />) }
      </div>
      
      <div className='flex flex-col justify-center select-none'><FontAwesomeIcon icon={faChevronRight} onClick={nextPage} className='cursor-pointer h-8 p-4 opacity-75 hover:opacity-100 transition-opacity' /></div>
    </div>
  )
}

export default Home
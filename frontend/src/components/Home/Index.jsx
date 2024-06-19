import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Content, Contents } from './Content'

export default function Home({ active, logged, setActive }) {
  const [contentIds, setContentIds] = useState([0, 1, 2])

  // Contentek közötti lapozás
  const nextPage = () => setContentIds([cIndex(contentIds[0] + 1), cIndex(contentIds[1] + 1), cIndex(contentIds[2] + 1)])
  const previousPage = () => setContentIds([cIndex(contentIds[0] - 1), cIndex(contentIds[1] - 1), cIndex(contentIds[2] - 1)])
  
  // Ha az index - 1 vagy index + 1 egy nem létező content id-t kap, akkor visszaadja a sor másik végén lévőt
  const cIndex = (index) => {
    return index < 0 ? Contents.length - 1 : index === Contents.length ? 0 : index
  }

  return (
    <div className={`absolute flex w-full mr-0 lg:mr-12 ${active ? '' : 'opacity-0 pointer-events-none select-none translate-y-4'} transition-all`}>
      <div className='flex flex-col justify-center select-none'><FontAwesomeIcon icon={faChevronLeft} onClick={previousPage} className='cursor-pointer h-8 p-4 opacity-75 hover:opacity-100 transition-opacity' /></div>
      
      <div className='relative w-full h-max lg:h-screen flex items-center justify-center'>
        { Contents.map((content, i) => <Content key={i} {...content} left={i === contentIds[0]} center={i === contentIds[1]} right={i === contentIds[2]} logged={logged} nextPage={nextPage} setActive={setActive} />) }
      </div>
      
      <div className='flex flex-col justify-center select-none'><FontAwesomeIcon icon={faChevronRight} onClick={nextPage} className='cursor-pointer h-8 p-4 opacity-75 hover:opacity-100 transition-opacity' /></div>
    </div>
  )
}
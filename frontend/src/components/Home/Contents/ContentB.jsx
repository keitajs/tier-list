import React from 'react'

function ContentB(props) {
  return (
    <div className={`absolute flex flex-col mx-6 ${props.selected ? 'transition-all' : `pointer-events-none opacity-0 ${props.animation === 0 ? 'translate-x-32' : '-translate-x-32'}`}`}>
      <h2 className='relative text-3xl font-semibold w-max mb-5 pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-2/5 after:h-0.5 after:rounded-lg after:bg-blue-500'>Lorem, ipsum dolor.</h2>
      <p className='my-1 leading-5 text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, distinctio. Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
      <p className='my-1 leading-5 text-lg'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi error laborum saepe provident hic soluta repudiandae obcaecati temporibus earum exercitationem?</p>
      
      <button onClick={() => props.setActive(2)} className='w-max mt-4 mb-1 ml-auto px-8 py-1.5 text-lg rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors'>Lorem, ipsum.</button>
    </div>
  )
}

export default ContentB
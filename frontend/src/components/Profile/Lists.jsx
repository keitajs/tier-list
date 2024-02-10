import React from 'react'

function Lists(props) {
  return (
    <div className='p-5 rounded-3xl bg-neutral-900/85'>
      <div className='flex items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>Legtöbbet módosított listák</div>
      <div className='flex flex-col gap-2.5 mt-3 items-center justify-center'>
      {props.lists.map(list =>
        <button key={list.id} onClick={() => props.history(`/list?id=${list.id}`)} className='flex items-center justify-between w-full px-4 py-3 rounded-xl even:bg-neutral-950/70 odd:bg-neutral-950/85 hover:bg-neutral-950/40 transition-all'>
          <div className='flex items-center text-xl'>{list.name}</div>
          <div className='flex items-center text-sm'><p><span className='text-blue-500 opacity-75'>{list.totalUpdates}</span><span className='opacity-40'> módosítás</span></p></div>
        </button>
      )}
      </div>
    </div>
  )
}

export default Lists
import React, { useMemo } from 'react'

function Activity(props) {
  const maxActivity = useMemo(() => Math.max(...props.weeklyActivies.map((activity) => activity.count)), [props.weeklyActivies])

  return (
    <div className='p-5 rounded-3xl bg-neutral-900/85'>
      <div className='flex items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>Heti aktivitás</div>
      {props?.weeklyActivies.length > 0 ? <>
        <div className='flex items-center justify-between h-96 pt-10'>
          {props.weeklyActivies.map((activity, i) =>
            <div key={i} className='flex flex-col items-center justify-end w-full h-full mt-5'>
              <div className='relative w-10 mt-1 mb-4 pb-2 rounded-xl bg-blue-500' style={{ height: `${activity.count/maxActivity*100}%` }}>
                <div className='absolute -top-8 left-0 right-0 text-center'>{activity.count}</div>
              </div>
            </div>  
          )}
        </div>
        <div className='flex items-center mt-3'>
          {props.weeklyActivies.map((activity, i) => <div key={i} className='w-full first-letter:uppercase text-center opacity-75'>{activity.day} {i === 6 ? '(Ma)' : ''}</div>)}
        </div>
      </> : <div className='flex items-center justify-center h-40 pt-6'><div className='h-1/2 aspect-square rounded-full border-e-4 border-neutral-700/50 animate-spin'></div></div>}
    </div>
  )
}

export default Activity
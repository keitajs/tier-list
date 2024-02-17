import React, { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'

function Activity(props) {
  const maxActivity = useMemo(() => Math.max(...props.weeklyActivies.map((activity) => activity.count)), [props.weeklyActivies])

  return (
    <div className='p-5 rounded-3xl bg-neutral-900/85'>
      <div className='flex items-center justify-between px-3 pb-2 text-xl border-b-2 border-blue-500'>Heti aktivitás</div>
      {props?.weeklyActivies.length > 0 ? <>
        <div className='flex items-center justify-between h-96 pt-10'>
          {props.weeklyActivies.map((activity, i) =>
            <div key={i} className='flex flex-col items-center justify-end w-full h-full mt-5'>
              <div id={`activity-${i}`} className='relative w-10 mt-1 mb-4 pb-2 rounded-xl bg-blue-500' style={{ height: `${activity.count/maxActivity*100}%` }}>
                <div className='absolute -top-8 left-0 right-0 text-center'>{activity.count}</div>
              </div>
              <Tooltip anchorSelect={`#activity-${i}`} place='right' className='!z-40 !rounded-lg !bg-neutral-950'>
                {activity.count > 0 ? activity.lists.sort((a, b) => b.count - a.count).map((list, j) => <div key={j} className='flex w-full justify-between gap-4'>{list.name}<div className='text-blue-400'>{list.count}</div></div>) : 'Ezen a napon nem volt aktivitás.'}
              </Tooltip>
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
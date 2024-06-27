import { useState, useEffect } from 'react'
import { getLists } from '../../user'
import DoughnutChart from '../charts/Doughnut'

function Doughnut({ segments, count, label, hover, setHover }) {
  const zeros = segments.every(d => d.percentage === 0)

  return (
    <div className='flex flex-col items-center justify-around h-full'>
      <div className='relative flex items-center justify-center'>
        <DoughnutChart
          hover={zeros ? undefined : hover}
          setHover={zeros ? () => {} : setHover}
          size={300}
          strokeWidth={30}
          totalPercentage={80}
          gap={zeros ? 0 : 1.5}
          segments={zeros ? segments.map((d, i) => i === segments.length - 1 ? { ...d, percentage: 100 } : { ...d }) : segments}
          className='h-full'
        />

        <div className='absolute text-center'>
          <p className='text-5xl'>{count}</p>
          <p>{label}</p>
        </div>
      </div>

      <div className='flex gap-5 *:text-center'>
        {segments.map(data => 
          <div
            key={data.name}
            onMouseEnter={() => setHover(data.name)}
            onMouseLeave={() => setHover(null)}
            className={`${hover === data.name ? 'scale-110' : 'scale-100'} cursor-default transition-all`}
          >
            <div><span style={{color: data.color}}>{data.count}</span> {data.label}</div>
            <div className='text-sm'>({Math.round(data.percentage)}%)</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Statistics({ loaded, update }) {
  const statusSkeleton = [
    { count: 0, percentage: 0, color: '#3b82f6', name: 'inprogress', label: 'folyamatban' }, 
    { count: 0, percentage: 0, color: '#10b981', name: 'completed', label: 'kész' }, 
    { count: 0, percentage: 0, color: '#ef4444', name: 'dropped', label: 'dobott' }
  ]
  const visibilitySkeleton = [
    { count: 0, percentage: 0, color: '#3b82f6', name: 'public', label: 'publikus' },
    { count: 0, percentage: 0, color: '#ef4444', name: 'private', label: 'privát' }
  ]

  const [prevActiveId, setPrevActiveId] = useState(0)
  const [statistics, setStatistics] = useState(null)
  const [hover, setHover] = useState(null)

  const updateStatistics = async () => {
    const data = await getLists()
    if (data.error) return console.error(data.error)

    let count = data.length
    let percentagePerStatus = statusSkeleton
    data.forEach(list => percentagePerStatus[list.status - 1].count++)
    percentagePerStatus = percentagePerStatus.map(pps => ({ ...pps, percentage: (pps.count / count || 0) * 100 }))

    let percentagePerVisibility = visibilitySkeleton
    data.forEach(list => percentagePerVisibility[Number(list.private)].count++)
    percentagePerVisibility = percentagePerVisibility.map(ppv => ({ ...ppv, percentage: (ppv.count / count || 0) * 100 }))

    let publicPercentage = Math.round((percentagePerVisibility[0].count / count || 0) * 100)

    let permissions = data.reduce((acc, list) => {
      const permissions = list.permissions.length
      acc.count += permissions
      if (permissions) acc.list++
      return acc
    }, { list: 0, count: 0 })
    permissions.percentage = Math.round((permissions.list / count || 0) * 100)

    let descriptions = data.reduce((acc, list) => acc + (list.description ? 1 : 0), 0)
    descriptions = { count: descriptions, percentage: Math.round((descriptions / count || 0) * 100) }

    setStatistics({ count, permissions, descriptions, percentagePerStatus, publicPercentage, percentagePerVisibility })
  }

  useEffect(() => {
    if (!loaded) return

    setPrevActiveId(update?.id)
    if (prevActiveId !== update?.id) return

    updateStatistics().catch(() => history('/'))
  }, [loaded, update])

  useEffect(() => {
    updateStatistics().catch(() => history('/'))
  }, [])

  return (
    <>
      <div className='flex items-center justify-evenly h-full w-full'>
        <Doughnut segments={statistics?.percentagePerStatus ?? statusSkeleton} count={statistics?.count ?? 0} label='lista' hover={hover} setHover={setHover} />

        <div className='flex flex-col items-center justify-around h-2/3 text-center'>
          <div>
            <p className='text-3xl'>{statistics?.permissions?.count ?? 0}</p>
            <p>jogosultság</p>
            <p className='text-sm'>(a listák {statistics?.permissions?.percentage ?? 0}%-ában)</p>
          </div>
          <div>
            <p className='text-3xl'>{statistics?.descriptions?.count ?? 0}</p>
            <p>lista rendelkezik leírással</p>
            <p className='text-sm'>({statistics?.descriptions?.percentage ?? 0}%)</p>
          </div>
        </div>

        <Doughnut segments={statistics?.percentagePerVisibility ?? visibilitySkeleton} count={<>{statistics?.publicPercentage ?? 0}%</>} label='publikus' hover={hover} setHover={setHover} />
      </div>
    </>
  )
}
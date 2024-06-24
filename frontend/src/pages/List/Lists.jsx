import { useEffect, useState } from 'react'
import { getLists } from '../../user'
import ManageList from '../../components/List/Lists/ManageList'
import ManagePermission from '../../components/List/Lists/ManagePermission'
import Box from '../../components/ui/Box'
import List from '../../components/List/Lists/List'
import DoughnutChart from '../../components/charts/Doughnut'

export default function Lists({ history, logged, setSelectedList }) {
  const [activeList, setActiveList] = useState(null)
  const [statistics, setStatistics] = useState(null)

  const getStatisztics = async () => {
    const data = await getLists()
    if (data.error) return console.error(data.error)

    let count = data.length
    let percentagePerStatus = [
      { count: 0, percentage: 0, color: '#3b82f6' }, 
      { count: 0, percentage: 0, color: '#10b981' }, 
      { count: 0, percentage: 0, color: '#ef4444' }
    ]
    data.forEach(list => percentagePerStatus[list.status - 1].count++)
    percentagePerStatus = percentagePerStatus.map(pps => ({ ...pps, percentage: (pps.count / count) * 100 }))

    let percentagePerVisibility = [
      { count: 0, percentage: 0, color: '#3b82f6' },
      { count: 0, percentage: 0, color: '#ef4444' }
    ]
    data.forEach(list => percentagePerVisibility[Number(list.private)].count++)
    percentagePerVisibility = percentagePerVisibility.map(ppv => ({ ...ppv, percentage: (ppv.count / count) * 100 }))

    let publicPercentage = Math.round(percentagePerVisibility[0].count / count * 100)

    let permissions = data.reduce((acc, list) => {
      const permissions = list.permissions.length
      acc.count += permissions
      if (permissions) acc.list++
      return acc
    }, { list: 0, count: 0 })
    permissions.percentage = Math.round(permissions.list / count * 100)

    let descriptions = data.reduce((acc, list) => acc + (list.description ? 1 : 0), 0)
    descriptions = { count: descriptions, percentage: Math.round(descriptions / count * 100) }

    setStatistics({ count, permissions, descriptions, percentagePerStatus, publicPercentage, percentagePerVisibility })
  }

  useEffect(() => {
    if (logged === null) return
    if (!logged) return history('/')

    getStatisztics().catch(() => history('/'))
  }, [logged])

  useEffect(() => {
    document.title = 'Listák | Tier List'
  }, [])

  return (
    <div className='flex flex-col xl:flex-row gap-6 max-w-full min-h-[calc(100vh-3rem)]'>
      <Box className='w-full xl:w-1/3 max-h-[calc(100vh/2)] xl:max-h-[calc(100vh-3rem)]'>
        <List history={history} loaded={logged !== null} activeList={activeList} setActiveList={setActiveList} />
      </Box>

      <div className='flex flex-col gap-6 w-full xl:w-1/3 grow'>
        <div className='flex flex-col 2xl:flex-row gap-6 xl:h-full 2xl:h-auto'>
          <Box className='w-full h-full'>
            <ManageList history={history} setSelectedList={setSelectedList} activeList={activeList} setActiveList={setActiveList} />
          </Box>
          <Box className='w-full h-full'>
            {activeList && <ManagePermission activeList={activeList} setActiveList={setActiveList} />}
            {!activeList &&
              <div className='flex items-center justify-center h-full w-full'>
                <span className='text-lg text-center text-orange-500'>Tartalom a jogosultságok helyére</span>
              </div>
            }
          </Box>
        </div>

        <Box className='flex xl:hidden 2xl:flex w-full h-full'>
          {statistics &&
            <div className='flex items-center justify-evenly h-full w-full'>
              <div className='flex flex-col items-center justify-around h-full'>
                <div className='relative flex items-center justify-center'>
                  <DoughnutChart size={300} strokeWidth={30} totalPercentage={80} gap={1.5} segments={statistics.percentagePerStatus} className='h-full' />

                  <div className='absolute text-center'>
                    <p className='text-5xl'>{statistics.count}</p>
                    <p>lista</p>
                  </div>
                </div>

                <div className='flex gap-5 *:text-center'>
                  <div>
                    <div><span className='text-blue-400'>{statistics.percentagePerStatus[0].count}</span> folyamatban</div>
                    <div className='text-sm'>({Math.round(statistics.percentagePerStatus[0].percentage)}%)</div>
                  </div>
                  <div>
                    <div><span className='text-emerald-400'>{statistics.percentagePerStatus[1].count}</span> kész</div>
                    <div className='text-sm'>({Math.round(statistics.percentagePerStatus[1].percentage)}%)</div>
                  </div>
                  <div>
                    <div><span className='text-rose-400'>{statistics.percentagePerStatus[2].count}</span> dobott</div>
                    <div className='text-sm'>({Math.round(statistics.percentagePerStatus[2].percentage)}%)</div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-center justify-around h-2/3 text-center'>
                <div>
                  <p className='text-3xl'>{statistics.permissions.count}</p>
                  <p>jogosultság</p>
                  <p className='text-sm'>(a listák {statistics.permissions.percentage}%-ában)</p>
                </div>
                <div>
                  <p className='text-3xl'>{statistics.descriptions.count}</p>
                  <p>lista rendelkezik leírással</p>
                  <p className='text-sm'>({statistics.descriptions.percentage}%)</p>
                </div>
              </div>

              <div className='flex flex-col items-center justify-around h-full'>
                <div className='relative flex items-center justify-center'>
                  <DoughnutChart size={300} strokeWidth={30} totalPercentage={80} gap={1.5} segments={statistics.percentagePerVisibility} className='h-full' />

                  <div className='absolute text-center'>
                    <p className='text-5xl'>{statistics.publicPercentage}%</p>
                    <p>publikus</p>
                  </div>
                </div>

                <div className='flex gap-5 *:text-center'>
                  <div>
                    <div><span className='text-blue-400'>{statistics.percentagePerVisibility[0].count}</span> publikus</div>
                    <div className='text-sm'>({Math.round(statistics.percentagePerVisibility[0].percentage)}%)</div>
                  </div>
                  <div>
                    <div><span className='text-red-500'>{statistics.percentagePerVisibility[1].count}</span> privát</div>
                    <div className='text-sm'>({Math.round(statistics.percentagePerVisibility[1].percentage)}%)</div>
                  </div>
                </div>
              </div>
            </div>
          }
        </Box>
      </div>
    </div>
  )
}
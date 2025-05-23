import { useEffect, useState } from 'react'
import Box from '../../components/ui/Box'
import ManageList from '../../components/list/ManageList'
import ManagePermission from '../../components/list/ManagePermission'
import List from '../../components/list/List'
import Statistics from '../../components/list/Statistics'

export default function Lists({ history, logged, setSelectedList }) {
  const [activeList, setActiveList] = useState(null)
  
  useEffect(() => {
    if (logged === null) return
    if (!logged) return history('/')
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
            <ManagePermission activeList={activeList} setActiveList={setActiveList} />
          </Box>
        </div>

        <Box className='flex xl:hidden 2xl:flex w-full h-full'>
          <Statistics loaded={logged !== null} update={activeList} />
        </Box>
      </div>
    </div>
  )
}
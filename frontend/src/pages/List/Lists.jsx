import { useEffect, useState } from 'react'
import ManageList from '../../components/List/Lists/ManageList'
import ManagePermission from '../../components/List/Lists/ManagePermission'
import List from '../../components/List/Lists/List'

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
    <div className='flex xl:flex-row flex-col sm:min-h-[calc(100vh-3rem)] xl:h-[calc(100vh-3rem)] gap-6'>
      <List history={history} loaded={logged !== null} activeList={activeList} setActiveList={setActiveList} />
      <ManageList history={history} setSelectedList={setSelectedList} activeList={activeList} setActiveList={setActiveList} />
      {activeList && <ManagePermission activeList={activeList} setActiveList={setActiveList} />}
    </div>
  )
}
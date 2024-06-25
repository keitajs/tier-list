import { useState, useEffect } from "react"
import { useDebounce } from 'use-debounce'
import { getLists, getSharedLists, getPublicLists } from '../../user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faList, faShare, faEye } from '@fortawesome/free-solid-svg-icons'
import { Switch, SwitchButton } from "../ui/Switch"
import Tooltip from "../ui/Tooltip"
import ListItem from './ListItem'

export default function List({ history, loaded, activeList, setActiveList }) {
  const [type, setType] = useState(0)
  const [query, setQuery] = useState('')
  const [queryValue] = useDebounce(query, 500)
  const [lists, setLists] = useState([])

  const getListsByType = async (type, query) => {
    const data = await [getLists, getSharedLists, getPublicLists][type](query)
    if (data.error) return history('/')

    setLists(data)
  }

  useEffect(() => {
    if (!loaded) return
    getListsByType(type, queryValue)
  }, [type, queryValue, loaded])

  useEffect(() => {
    if (type !== 0 && activeList) return setType(0)

    getListsByType(type, queryValue)
  }, [activeList])

  return (
    <>
      <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
        {['Saját listák', 'Megosztott listák', 'Publikus listák'][type]}

        <div className="flex items-center gap-4">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Keresés..." className="px-2.5 py-1 rounded-lg outline-none text-xs bg-neutral-700/50 placeholder:text-neutral-400" />

          <Switch value={type} setValue={setType}>
            <SwitchButton id='list'>
              <FontAwesomeIcon icon={faList} className='h-3' />
            </SwitchButton>
            <SwitchButton id='shared'>
              <FontAwesomeIcon icon={faShare} className='h-3' />
            </SwitchButton>
            <SwitchButton id='public'>
              <FontAwesomeIcon icon={faEye} className='h-3' />
            </SwitchButton>
          </Switch>

          <Tooltip id='list' place='bottom'>Saját listák</Tooltip>
          <Tooltip id='shared' place='bottom'>Megosztott listák</Tooltip>
          <Tooltip id='public' place='bottom'>Publikus listák</Tooltip>
        </div>
      </div>
      <div className='flex flex-col gap-2.5 grow -mr-2 pr-2 overflow-y-auto'>
        {lists && lists.length > 0 ?
          lists.map(list =>
            <ListItem
              key={list.id}
              list={list}
              activeList={activeList}
              onClick={type === 0 ? (() => activeList?.id === list.id ? setActiveList(null) : setActiveList(list)) : (() => history(`/list/editor?id=${list.id}`))}
              onDoubleClick={() => history(`/list/editor?id=${list.id}`)}
            />
          )
        :
          <div className='flex items-center justify-center h-full opacity-50'>
            Nem található lista.
          </div>
        }
        
        {(type === 0 && activeList) &&
          <button onClick={() => setActiveList(null)} className='group flex items-center justify-center mx-2 mt-2 py-2.5 rounded-xl bg-neutral-950/30 hover:bg-neutral-950/20 transition-all'>
            <FontAwesomeIcon icon={faPlus} className='mx-2 group-hover:ml-0' />
            <span className='text-xl w-0 max-w-max group-hover:w-32 text-nowrap whitespace-nowrap overflow-hidden transition-[width]'>Új lista</span>
          </button>
        }
      </div>
    </>
  )
}
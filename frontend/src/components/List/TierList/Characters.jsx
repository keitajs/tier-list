import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faSearch, faFileArrowUp, faCheck, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import Item from './Item'

function Characters(props) {
  const {setNodeRef} = useSortable({
    id: props.id,
    data: { type: "Category", category: { id: props.id, name: props.name, color: props.color } },
    disabled: true
  })
  const itemIds = useMemo(() => props.items.map(item => item.id), [props.items])

  const [create, setCreate] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [title, setTitle] = useState('')
  const [animeUrl, setAnimeUrl] = useState('')

  const [query, setQuery] = useState('')
  const [queryValue] = useDebounce(query, 500)
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const createItem = async () => {
    if (!isCorrect(name, { max: 256 })) return
    if (!isCorrect(url, { url: true })) return
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)) return
    if (!isCorrect(title, { max: 256 })) return
    if (!isCorrect(animeUrl, { url: true })) return

    try {
      const { data } = await axios.post(`http://localhost:2000/lists/${props.selectedList}/characters/create`, {
        character: { name, url, image },
        anime: { title, url: animeUrl }
      })

      data.categoryId = props.id
      props.setItems(items => [...items, data])
      setCreate(false)
    } catch (err) {
      if (err.response.data.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  const isCorrect = (value, options) => {
    if (!value) return false
    if (options.url) try { new URL(value) } catch (error) { return false }
    if (options.max) if (value.length > options.max) return false
    if (options.image) try { new URL(value) } catch (error) { return false }
    return true
  }

  const searchResults = async (query) => {
    if (query.length < 4) return setResults([])

    try {
      const { data } = await (await fetch(`https://api.jikan.moe/v4/characters?q=${query}&limit=15`)).json()
      if (data) setResults(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fillInputs = async (id) => {
    const { data } = await (await fetch(`https://api.jikan.moe/v4/characters/${id}/full`)).json()
    setName(data.name)
    setUrl(data.url)
    setImage(data.images.jpg.image_url)
    setTitle(data.anime[0].anime.title)
    setAnimeUrl(data.anime[0].anime.url)
    setQuery('')
    setResults([])
  }

  useEffect(() => {
    setName('')
    setUrl('')
    setImage('')
    setTitle('')
    setAnimeUrl('')
  }, [create])

  useEffect(() => {
    searchResults(queryValue)
  }, [queryValue])

  return (
    <div ref={setNodeRef} className='flex bg-neutral-900/85 rounded-2xl'>
      <div className='flex flex-wrap w-full lg:min-h-32 md:min-h-28 min-h-24'>
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {props.items.map(item => <Item key={item.id} permission={props.permission} id={item.id} character={{ name: item.name, url: item.url, img: item.image }} anime={{ id: item.anime.id, title: item.anime.title, url: item.anime.url }} selectedList={props.selectedList} setItems={props.setItems} />)}
          {props.permission?.edit ?
            <button onClick={() => setCreate(true)} className='group flex flex-col items-center justify-center lg:h-32 md:h-28 h-24 aspect-[3/4] ml-0.5 rounded-2xl border-2 border-neutral-900 hover:border-neutral-400 bg-neutral-900 transition-all'>
              <p className='flex items-center justify-center w-full lg:h-9 h-8 bg-neutral-900 z-10'><FontAwesomeIcon icon={faAdd} className='h-7' /></p>
              <p className='lg:text-sm text-xs lg:-mt-9 -mt-8 lg:group-hover:mt-2 group-hover:mt-1 overflow-hidden transition-all'>Karakter hozzáadás</p>
            </button>
          : <></>}
        </SortableContext>
      </div>

      <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/50 ${create ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-all`}>
        <div className='p-4 rounded-2xl bg-neutral-800'>
          <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
            <div className='text-xl'>Új karakter</div>
            <div className='relative flex items-center w-1/2' onMouseEnter={() => setShowResults(true)} onMouseLeave={() => setShowResults(false)}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} className='w-full pl-2 pr-8 py-1 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' placeholder='Karakter keresése...' />
              <FontAwesomeIcon icon={faSearch} className='position absolute right-2 h-4 pointer-events-none' />

              <div className={`z-30 absolute top-full w-full max-h-64 flex flex-col rounded-lg bg-neutral-700 overflow-hidden overflow-y-auto ${results && showResults ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all`}>
                {results.map((result, i) =>
                  <button key={result.mal_id} onClick={() => fillInputs(result.mal_id)} className='group relative flex items-center gap-3 text-base even:bg-neutral-800/25 odd:bg-neutral-700 hover:bg-neutral-600 transition-all'>
                    <div className='flex items-center justify-center h-16 aspect-[3/4] rounded-sm overflow-hidden'>
                      <img src={result.images.webp.image_url} alt="" className='w-full h-full object-cover' />
                    </div>
                    {result.name}
                    <FontAwesomeIcon icon={faPlus} className='absolute right-4 opacity-0 group-hover:opacity-65 transition-opacity' />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='flex flex-col justify-between'>
              <div className='flex items-center justify-center h-48 aspect-[3/4] rounded-xl bg-neutral-700/50 overflow-hidden'>
                {/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image) ? <img src={image} alt="" className='w-full h-full object-cover' /> : <div className='m-2 text-center text-sm opacity-50'>Tölts fel egy képet vagy illeszd be linkként!</div>}
              </div>
              <div className='flex flex-col gap-2'>
                <button onClick={createItem} className='py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Létrehozás</button>
                <button onClick={() => setCreate(false)} className='py-1 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <div className='relative flex flex-col gap-2 rounded-xl p-2.5 pt-2 pr-32 text-lg bg-neutral-900/35'>
                <div className='flex flex-col'>
                  <label htmlFor="name" className='ml-1'>Név</label>
                  <div className='relative'>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} name='name' id='name' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
                    <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{isCorrect(name, { max: 256 }) ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="url" className='ml-1'>URL</label>
                  <div className='relative'>
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} name='url' id='url' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
                    <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{isCorrect(url, { url: true }) ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="image" className='ml-1'>Kép</label>
                  <div className='relative flex items-center'>
                    <input type="text" value={image} onChange={e => setImage(e.target.value)} name='image' id='image' className='w-72 px-2 py-1 pr-9 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
                    <button className='absolute right-0 h-full aspect-square flex items-center justify-center rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors'>
                      <FontAwesomeIcon icon={faFileArrowUp} />
                    </button>
                  </div>
                </div>

                <div className='absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center tracking-wider'><div className='rotate-90'>Karakter</div></div>
              </div>

              <div className='relative flex flex-col gap-2 rounded-xl p-2.5 pt-2 pr-32 text-lg bg-neutral-900/35'>
                <div className='flex flex-col'>
                  <label htmlFor="title" className='ml-1'>Cím</label>
                  <div className='relative'>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} name='title' id='title' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
                    <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{isCorrect(title, { max: 256 }) ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="animeUrl" className='ml-1'>URL</label>
                  <div className='relative'>
                    <input type="text" value={animeUrl} onChange={e => setAnimeUrl(e.target.value)} name='animeUrl' id='animeUrl' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
                    <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'>{isCorrect(animeUrl, { url: true }) ? <FontAwesomeIcon icon={faCheck} className='text-emerald-500 h-5 input-check-anim' /> : <FontAwesomeIcon icon={faXmark} className='text-rose-500 h-5 input-error-anim' />}</div>
                  </div>
                </div>

                <div className='absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center tracking-wider'><div className='rotate-90'>Anime</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Characters
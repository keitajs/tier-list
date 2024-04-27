import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

function EmailVerification(props) {
  const [searchParams] = useSearchParams()
  const [verify, setVerify] = useState(null)
  const [msg, setMsg] = useState('')

  // Bejelentkezés ellenőrzés
  const getLogged = async () => {
    const { data } = await axios.get('/logged')
    if (!data) {
      setVerify(2)
      setMsg('Email hitelesítés előtt kérlek jelentkezz be!')
      return
    }

    await axios.get('/user/token/refresh')
    setVerify(0)
  }

  // Email hitelesítés
  const verifyEmail = async (history, searchParams) => {
    const token = searchParams.get('token')

    try {
      const { data } = await axios.post('/user/email/verify', { token })
      setVerify(1)
      setMsg(data.message)
    } catch (error) {
      setVerify(2)
      setMsg(error.response.data.message)
    }
  }

  useEffect(() => {
    if (verify !== 0) return
    verifyEmail(props.history, searchParams)
  }, [verify, props, searchParams])

  useEffect(() => {
    document.title = 'Email hitelesítés | Tier List'
    getLogged()
  }, [props])

  return (
    <div className='flex flex-col items-center justify-center w-svw h-svh'>
      {verify === 0 ?
        <div className='flex gap-4 items-center justify-center w-svw h-svh text-xl'>
          <div className='w-7 h-7 border-2 border-transparent border-x-white rounded-full animate-spin'></div>
          Email hitelesítése...
        </div>
      : 
        <div className={`flex items-center justify-center text-xl ${verify === 1 ? 'text-white' : 'text-red-200'}`}>
          <FontAwesomeIcon icon={verify === 1 ? faCheck : faXmark} className={`absolute h-12 opacity-10 ${verify === 1 ? 'input-check-anim' : 'input-error-anim'}`} />
          {msg}
        </div>
      }

      <button onClick={() => props.history('/')} className='w-max mt-4 px-8 py-1.5 rounded-lg bg-neutral-600 hover:bg-neutral-500 transition-colors'>Vissza a főoldalra</button>
    </div>
  )
}

export default EmailVerification
import React from 'react'
import Input from '../Form/Input'

function Email(props) {
  const emailChange = (e) => {
    const { value } = e.target
    props.setEmail(value)

    if (value === '') return props.setEmailMsg('Adj meg egy emailt!')
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value)) return props.setEmailMsg('Az email cím nem megfelelő!')
    props.setEmailMsg('')
  }

  return (
    <Input name='email' label='Email' type='email' value={props.email} message={props.emailMsg} onChange={emailChange} />
  )
}

export default Email
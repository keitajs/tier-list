import React from 'react'
import Input from '../../Form/Input'

function Username(props) {
  const usernameChange = (e) => {
    const { value } = e.target
    props.setUsername(value)

    if (value === '') return props.setNameMsg('Adj meg egy felhasználónevet!')
    props.setNameMsg('')
  }

  return (
    <Input name='name' label='Felhasználónév' type='text' value={props.username} message={props.nameMsg} onChange={usernameChange} />
  )
}

export default Username
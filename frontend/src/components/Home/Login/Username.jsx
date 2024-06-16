import React from 'react'
import Input from '../../Form/Input'

function Username(props) {
  const usernameChange = (e) => {
    props.setUsername(e.target.value)

    if (e.target.value === '') props.setNameMsg('Add meg felhasználóneved vagy email címed!')
    else props.setNameMsg('')
  }

  return (
    <Input name='username' label='Felhasználónév vagy email' type='text' value={props.username} message={props.nameMsg} onChange={usernameChange} />
  )
}

export default Username
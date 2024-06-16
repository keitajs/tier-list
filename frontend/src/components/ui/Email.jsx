import { useEffect } from 'react'
import Input from './Input'

export default function Email({ label, value, setValue, error, setError, validation, errors, reset, disabled }) {
  const onChange = (e) => {
    const { value } = e.target
    setValue(value)
  }

  const handleErrors = () => {
    if (value === '') return setError(errors?.empty || 'Adj meg egy emailt!')
    if (validation && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return setError(errors?.valid || 'Az email cím nem megfelelő!')
    setError('')
  }

  useEffect(() => {
    handleErrors()
  }, [value])

  return (
    <Input name='email' label={label || 'Email'} type='email' value={value} message={error} onChange={onChange} reset={reset} disabled={disabled} />
  )
}
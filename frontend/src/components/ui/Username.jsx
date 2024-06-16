import { useEffect } from 'react'
import Input from './Input'

export default function Username({ label, value, setValue, error, setError, validation, errors, reset, disabled }) {
  const onChange = (e) => {
    const { value } = e.target
    setValue(value)
  }

  const handleErrors = () => {
    if (value === '') return setError(errors?.empty || 'Adj meg egy felhasználónevet!')
    if (validation && !/^[^ \!\"#\$%&'\(\)\*\+,\/:;<=>\?@\[\\\]\^`\{\|\}~]+$/gm.test(value)) return setError(errors?.valid || 'A felhasználóneved nem tartalmazhat speciális karaktereket és szóközöket!')
    setError('')
  }

  useEffect(() => {
    handleErrors()
  }, [value])

  return (
    <Input name='username' label={label || 'Felhasználónév'} type='text' value={value} message={error} onChange={onChange} reset={reset} disabled={disabled} />
  )
}
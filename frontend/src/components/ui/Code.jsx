import { useRef, useEffect } from 'react'

export default function Code({ label, value, setValue, error, setError, errors, className }) {
  const inputRefs = useRef([])

  const onChange = (i, value) => {
    setValue(code => {
      const maxIndex = (value.length + i > 6 ? 6 : value.length + i)

      if (value.length > 1 && i < 6 && code[i + 1] === '') {
        for (let index = i; index < maxIndex; index++)
          code[index] = value[index].toUpperCase()
        inputRefs.current[maxIndex - 1].focus()
      }
      else {
        code[i] = value?.[0] ? value[0].toUpperCase() : value
        if (value && i + 1 < 6) inputRefs.current[i + 1].focus()
      }

      return [...code]
    })
  }

  const onKeyDown = (i, event) => {
    if (event.key === 'Backspace' && !value[i] && i > 0) {
      setValue(code => {
        code[i - 1] = ''
        return [...code]
      })
      inputRefs.current[i - 1].focus()
    }
  }

  const handleErrors = () => {
    if (!value.includes('')) setError('')
      else setError(errors?.empty || 'Írd be az üzenetben kapott kódot!')
  }

  useEffect(() => {
    handleErrors()
  }, [value])

  return (
    <div className={`w-64 flex flex-col ${className ?? ''}`}>
      <div className='flex'>
        <label className='ml-1 mb-0.5 text-lg'>{label || 'Hitelesítő kód'}</label>
      </div>
      <div className='flex items-center gap-0.5 rounded-lg overflow-hidden'>
        {value.map((char, i) => 
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type='text'
            name={`code-${i}`}
            className={`w-full py-2 text-center outline-none bg-neutral-700/75`}
            maxLength={6 - i}
            value={char}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
          />
        )}
      </div>
      <span className='w-64 ml-1 text-sm text-rose-600'>{error}</span>
    </div>
  )
}
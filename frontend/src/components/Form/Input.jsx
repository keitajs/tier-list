import React from 'react'

function Input(props) {
  return (
    <div className="mt-2 flex flex-col">
      <label htmlFor={props.name}>{props.label}</label>
      <input type={props.type} name={props.name} id={props.name} className={`w-64 px-2 py-1 bg-slate-700 rounded-md outline-none border ${props.message === '' ? `border-green-600` : `border-red-600`}`} value={props.value} onChange={props.onChange} />
      <span className='w-64 text-xs text-red-600'>{props.message}</span>
    </div>
  )
}

export default Input
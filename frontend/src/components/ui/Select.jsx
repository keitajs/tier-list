import { Children, cloneElement } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function Select({ children, value, setValue, values, startIndex, className }) {
  return (
    <div className={'flex items-center gap-2 ' + className}>
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          onClick: () => setValue(values ? values[index] : (startIndex + index)),
          selected: value === (values ? values[index] : (startIndex + index))
        })
      )}
    </div>
  )
}

export function SelectButton({ children, id, onClick, selected, className, icon, iconClassName }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full rounded-lg bg-neutral-700/25 transition-colors ${selected ? 'pointer-events-none' : 'hover:bg-neutral-700/50'} ${className ?? ''}`}
    >
      {icon && 
        <div className='flex items-center justify-center h-9 aspect-square'>
          <FontAwesomeIcon icon={icon} className={(iconClassName ?? '')} />
        </div>
      }

      <div className={`w-full py-1.5 rounded-lg ${selected ? 'bg-blue-500' : 'bg-neutral-700/65'} transition-all`}>
        {children}
      </div>
    </button>
  )
}
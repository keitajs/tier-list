import { Children, cloneElement } from "react"

export function Switch({ children, value, setValue, className }) {
  return (
    <div className={'relative flex items-center rounded-xl bg-neutral-700/50 overflow-hidden ' + className}>
      <div
        className={`absolute left-[--left] w-10 h-full rounded-xl bg-blue-500 transition-all`}
        style={{'--left': (value / Children.count(children))*100 + '%'}}
      ></div>

      {Children.map(children, (child, index) =>
        cloneElement(child, {
          onClick: () => setValue(index),
          selected: value === index
        })
      )}
    </div>
  )
}

export function SwitchButton({ children, id, onClick, selected, className }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`z-10 flex items-center justify-center w-10 py-1.5 rounded-xl ${!selected ? 'hover:bg-neutral-700/75' : ''} transition-all ` + className}
    >
      {children}
    </button>
  )
}
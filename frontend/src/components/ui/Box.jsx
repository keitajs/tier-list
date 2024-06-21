export default function Box({ children, className }) {
  return (
    <div className={'flex flex-col p-5 rounded-3xl shadow-md shadow-neutral-900/30 bg-neutral-900/50 ' + (className ?? '')}>
      {children}
    </div>
  )
}
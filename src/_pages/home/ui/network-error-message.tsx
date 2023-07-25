import { MouseEventHandler } from 'react'

type Props = {
  message: string
  onClose: MouseEventHandler
}

export function NetworkErrorMessageView({ message, onClose }: Props) {
  return (
    <div>
      <p>{message}</p>
      <button onClick={onClose}>close</button>
    </div>
  )
}

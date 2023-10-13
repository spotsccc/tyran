import { ReactElement, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Cross } from '@/shared/ui/select/assets'

type ModalProps = {
  Content: ReactElement
  isOpened: boolean
  close: () => void
}

export function Modal({ isOpened, Content, close }: ModalProps) {
  const [root, setRoot] = useState<Element | null>(null)
  useEffect(() => {
    setRoot(document.querySelector('#portal'))
  }, [setRoot])
  if (!root || !isOpened) {
    return null
  }
  return createPortal(
    <div className="absolute p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-1 bg-base-white border-base-black rounded-lg">
      <Cross onClick={close} />
      {Content}
    </div>,
    root,
  )
}

import { MouseEventHandler } from 'react'

type Props = {
  onClick?: MouseEventHandler
  title: string
}

export function TestComponent({ onClick, title }: Props) {
  return (
    <div data-testid="test-component">
      <h1 data-testid="header">{title}</h1>
      <button onClick={onClick}>Click</button>
    </div>
  )
}

import { cva, cx } from 'class-variance-authority'
import { MouseEventHandler, PropsWithChildren, RefObject } from 'react'

export type Type = 'primary' | 'secondary' | 'tertiary'

export type Props = PropsWithChildren<{
  onClick?: MouseEventHandler
  disabled?: boolean
  active?: boolean
  pressed?: boolean
  forwardRef?: RefObject<HTMLButtonElement>
  className?: string
}>

const buttonStyles = cva(
  'rounded-full px-6 py-4 text-color-base-white border-1 border-base-white text-sm hover:bg-base-white/10 w-max',
  {
    variants: {
      disabled: {
        true: 'opacity-50',
      },
      active: {
        true: 'bg-base-white text-base-black',
      },
      pressed: {
        true: 'bg-base-white/40',
      },
    },
    compoundVariants: [],
  },
)

export function Button({
  forwardRef,
  disabled,
  onClick,
  active,
  className,
  children,
  pressed,
}: Props) {
  return (
    <button
      onClick={onClick}
      ref={forwardRef}
      disabled={disabled}
      className={cx(buttonStyles({ disabled, active, pressed }), className)}
    >
      {children}
    </button>
  )
}

import { cva, cx } from 'class-variance-authority'
import { MouseEventHandler, RefObject } from 'react'

export type Type = 'primary' | 'secondary' | 'tertiary'
export type Color = 'blue' | 'gray' | 'red'
export type Size = 'sm' | 'md' | 'lg' | 'xl'

export type Props = {
  onClick?: MouseEventHandler
  disabled?: boolean
  type?: Type
  color?: Color
  size?: Size
  forwardRef?: RefObject<HTMLButtonElement>
  className?: string
  title: string
}

const buttonStyles = cva('rounded-lg box-border border-1', {
  variants: {
    size: {
      sm: 'px-3 py-1',
      md: 'px-4 py-2',
      lg: 'px-5 py-3',
      xl: 'px-6 py-4',
    },
    type: {
      primary: '',
      secondary: '',
      tertiary: '',
    },
    color: {
      blue: '',
      gray: '',
      red: '',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
  },
  compoundVariants: [
    {
      type: 'primary',
      color: 'blue',
      className:
        'bg-primary-600 border-primary-600 text-base-white hover:bg-primary-700 hover:border-primary-700',
    },
    {
      type: 'primary',
      color: 'red',
      className:
        'bg-error-600 border-error-600 text-base-white hover:bg-error-700 hover:border-error-700',
    },
    {
      type: 'primary',
      color: 'gray',
      className:
        'bg-gray-200 border-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-300',
    },
    {
      type: 'secondary',
      color: 'blue',
      className:
        'bg-primary-50 border-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-100',
    },
    {
      type: 'secondary',
      color: 'red',
      className:
        'bg-error-50 border-error-50 text-error-700 hover:bg-error-100 hover:border-error-10',
    },
    {
      type: 'secondary',
      color: 'gray',
      className: 'border-gray-300 text-gray-700 hover:bg-gray-50',
    },
    {
      type: 'tertiary',
      color: 'blue',
      className:
        'text-primary-700 border-base-white hover:bg-primary-50 hover:border-primary-50',
    },
    {
      type: 'tertiary',
      color: 'red',
      className:
        'text-error-700 border-base-white hover:bg-error-50 hover:border-error-50',
    },
    {
      type: 'tertiary',
      color: 'gray',
      className:
        'text-gray-700 border-base-white hover:bg-gray-50 hover:border-gray-50',
    },
  ],
})

export function Button({
  color = 'blue',
  title,
  size = 'md',
  type = 'primary',
  forwardRef,
  disabled,
  onClick,
  className,
}: Props) {
  return (
    <button
      onClick={onClick}
      ref={forwardRef}
      disabled={disabled}
      className={cx(buttonStyles({ size, type, color, disabled }), className)}
    >
      {title}
    </button>
  )
}

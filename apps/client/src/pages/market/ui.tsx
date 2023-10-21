import { cx } from 'class-variance-authority'
import { FiltersIcon } from '@/shared/assets'
import { ChangeEventHandler } from 'react'
import { Header } from '@/widgets/header'
import { Avatar } from '@/widgets/avatar'
import { artifactFeed } from '@/widgets/artifact/feed'
import { $$artifactFeed } from './model'

export function MarketPage() {
  return (
    <div className={cx('px-6 py-7', 'md:px-8')}>
      <Header className="pb-9 md:pb-13" />
      <Avatar
        className="pb-10 md:pb-13"
        address="address"
        username="username"
      />
      <artifactFeed.Ui model={$$artifactFeed} />
    </div>
  )
}

export type SearchInputProps = {
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  className?: string
  onIconClick?: () => void
}

export function SearchInput({ value, onChange, className }: SearchInputProps) {
  return (
    <div className="relative">
      <FiltersIcon className="absolute top-4 right-6 md:hidden" />
      <input
        onChange={onChange}
        value={value}
        placeholder="Search by name"
        className={cx(
          className,
          'w-full text-base-white bg-base-black border-base-white h-9 opacity-50',
          'focus:opacity-100 focus:outline-none',
          'max-md:rounded-xxl max-md:border-1 max-md:px-6',
          'md:border-b-2 md:text-2xl',
        )}
      />
    </div>
  )
}

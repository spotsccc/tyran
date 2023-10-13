import { useUnit } from 'effector-react'
import { $artifacts, $artifactsIds, $loading, $lots, $lotsIds } from './model'
import { cx } from 'class-variance-authority'
import { Burger } from '@/shared/ui/burger'
import { RombIcon } from '@/shared/assets'

export function MarketPage() {
  return (
    <div>
      <Header />
      <Avatar address="address" username="username" />
    </div>
  )
}

export type HeaderProps = {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cx(className, 'flex justify-between')}>
      <Logo />
      <Burger />
    </header>
  )
}

export function Logo() {
  return <div className="text-base-white font-bold text-xl">Tyran</div>
}

export type AvatarProps = {
  className?: string
  username: string | null
  address: string | null
}

export function Avatar({ className }: AvatarProps) {
  return (
    <div className={cx(className, 'flex gap-4')}>
      <img className="rounded-full border-1 border-base-white w-10 h-10" />
      <div>
        <div className="text-base-white mb-2">Username</div>
        <div className="flex gap-1 text-sm items-center text-base-white opacity-50">
          <RombIcon />
          ADDRESS
        </div>
      </div>
    </div>
  )
}

export function SearchInput() {
  return (
    <input
      placeholder="Search by name"
      className="w-full rounded-xxl px-6 text-base-white bg-base-black border-1 border-base-white h-9"
    />
  )
}

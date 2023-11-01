import { Burger } from '@/shared/ui/burger'
import { cx } from 'class-variance-authority'

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
  return (
    <div className="text-base-white font-bold text-xl flex items-center">
      Tyran{' '}
      <span className="max-md:hidden">
        — <span className="font-normal">Marketplace</span>
      </span>
    </div>
  )
}

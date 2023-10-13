import { accountConnect } from '@/features/account/connect'
import { Burger } from '@/shared/ui/burger'
import { $$accountConnect } from '../model'
import { ArtifactsInfiniteScroll } from './artifacts-infinite-scroll'
import { RombIcon } from '@/shared/assets'
import { cx } from 'class-variance-authority'
import { reflect } from '@effector/reflect'
import { getUserQuery } from '@/shared/api/users'

export function MyArtifactsPage() {
  return (
    <div className="bg-base-black w-full h-screen px-6 py-7">
      <Header className="pb-9" />
      <AvatarB className="pb-8" />
      <SearchInput />
      <ArtifactsInfiniteScroll />
      <accountConnect.ConnectAccountModal model={$$accountConnect} />
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
  username?: string
  address?: string
  avatar?: string
}

const AvatarB = reflect({
  view: Avatar,
  bind: {
    username: getUserQuery.$data.map((user) => user?.username),
    address: getUserQuery.$data.map((user) => user?.address),
    avatar: getUserQuery.$data.map((user) => user?.avatar),
  },
})

export function Avatar({ className, username, address, avatar }: AvatarProps) {
  return (
    <div className={cx(className, 'flex gap-4')}>
      <img
        src={avatar}
        className="rounded-full w-10 h-10 min-w-[64px]"
        alt="avatar"
      />
      <div>
        <p className="text-base-white max-w-[50%] mb-2 overflow-hidden whitespace-nowrap text-ellipsis">
          {username}
        </p>
        <div className="flex gap-1 items-center max-w-fit">
          <RombIcon />
          <p className="text-sm text-base-white opacity-50 max-w-[50%] overflow-hidden whitespace-nowrap text-ellipsis">
            {address}
          </p>
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

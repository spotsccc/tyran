import { cx } from 'class-variance-authority'
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





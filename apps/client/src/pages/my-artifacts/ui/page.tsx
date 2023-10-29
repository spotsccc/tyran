import { Header } from '@/widgets/header'
import { Avatar } from '@/widgets/avatar'
import { artifactFeed } from '@/widgets/artifact/feed'
import { artifactsFeedModel } from '../model'

export function MyArtifactsPage() {
  return (
    <div className="bg-base-black w-full h-screen px-6 py-7">
      <Header className="pb-9" />
      <Avatar username="username" address="address" className="pb-10" />
      <artifactFeed.Ui model={artifactsFeedModel} />
    </div>
  )
}

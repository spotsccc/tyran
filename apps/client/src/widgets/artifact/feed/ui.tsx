import { ArtifactList } from '@/entities/artifact'
import { modelView } from 'effector-factorio'
import { factory } from './model'
import { useUnit } from 'effector-react'

export const ArtifactFeed = modelView(factory, () => {
  const { $artifactsIds, $artifactsEntities } = factory.useModel()
  const { ids } = useUnit({ ids: $artifactsIds })
  return <ArtifactList ids={ids} $artifacts={$artifactsEntities} />
})

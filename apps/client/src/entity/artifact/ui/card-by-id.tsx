import { Artifact } from 'api-contract'
import { Store } from 'effector'
import { useStoreMap } from 'effector-react'
import { ArtifactCard } from '@/entity/artifact'

export type ArtifactCardByIdProps = {
  id: string
  $artifacts: Store<Record<string, Artifact>>
}

export function ArtifactCardById({ $artifacts, id }: ArtifactCardByIdProps) {
  const { rarity, name, gems, property } = useStoreMap({
    store: $artifacts,
    keys: [id],
    fn: (artifacts, [id]) => artifacts[id],
  })
  return (
    <ArtifactCard
      id={id}
      name={name}
      rarity={rarity}
      property={property}
      gems={gems}
    />
  )
}

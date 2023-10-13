import './model'
import { useUnit } from 'effector-react'
import { ArtifactCard } from '@/entity/artifact'
import { PlaceToMarketButton } from '@/features/artifact/place-to-market'
import { getArtifactQuery } from '@/shared/api/get-artifact'

export function ArtifactPage() {
  const { data } = useUnit({
    data: getArtifactQuery.$data,
  })
  if (!data) {
    return <div>loading</div>
  }
  return (
    <div>
      <ArtifactCard
        id={data.artifact.id}
        name={data.artifact.name}
        rarity={data.artifact.rarity}
        property={data.artifact.property}
        gems={data.artifact.gems}
      />
      <PlaceToMarketButton id={data.artifact.id} />
    </div>
  )
}

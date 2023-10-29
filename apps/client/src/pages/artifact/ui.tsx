import './model'
import { useUnit } from 'effector-react'
import { ArtifactCard } from '@/entities/artifact'
import { PlaceToMarketButton } from '@/features/artifact/place-to-market'
import { getArtifactQuery } from '@/shared/api/get-artifact'
import { $$account } from '@/shared/ethereum'

export function ArtifactPage() {
  const { data, selectedAccount } = useUnit({
    data: getArtifactQuery.$data,
    selectedAccount: $$account.outputs.$selected,
  })
  if (!data) {
    return <div>loading</div>
  }
  const isOwnArtifact = data.artifact.owner === selectedAccount?.address 
  const isPlaced = Boolean(data.lot)
  return (
    <div>
      <ArtifactCard
        id={data.artifact.id}
        name={data.artifact.name}
        rarity={data.artifact.rarity}
        property={data.artifact.property}
        gems={data.artifact.gems}
        owner={data.artifact.owner}
      />
      {!isPlaced && isOwnArtifact && <PlaceToMarketButton id={data.artifact.id} />
}    </div>
  )
}

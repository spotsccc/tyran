import { useUnit } from 'effector-react'
import { placeButtonPressed } from '@/features/artifact/place-to-market/model'
import { Button } from '@/shared/ui/button'

export type PlaceToMarketProps = {
  id: string
}

export function PlaceToMarketButton({ id }: PlaceToMarketProps) {
  const { placeToMarket } = useUnit({ placeToMarket: placeButtonPressed })
  return (
    <Button
      type="primary"
      color="blue"
      size="md"
      title="Place to market"
      onClick={() => placeToMarket(id)}
    />
  )
}

import { useUnit } from 'effector-react/compat'
import { Button } from '@/shared/ui/button'
import { buyButtonClicked } from './model'

export type BuyFromMarketButtonProps = {
  id: string
  value: string
}

export function BuyFromMarketButton({ id, value }: BuyFromMarketButtonProps) {
  const { buyFromMarket } = useUnit({ buyFromMarket: buyButtonClicked })
  return (
    <Button
      type="primary"
      color="blue"
      size="md"
      title="Buy"
      onClick={() => buyFromMarket({ tokenId: id, value })}
    />
  )
}

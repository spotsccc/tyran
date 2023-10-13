import { attach, createEvent, sample } from 'effector'
import { $$shop } from '@/shared/ethereum'

export const buyButtonClicked = createEvent<{
  tokenId: string
  value: string
}>()

export const buyFromMarketFx = attach({
  effect: $$shop.inputs.buyArtifactFromMarketFx,
})

sample({
  clock: buyButtonClicked,
  target: buyFromMarketFx,
})

import { createEvent, sample } from 'effector'
import { $$shop } from '@/shared/ethereum'

export const placeButtonPressed = createEvent<string>()

export const placeToMarketFx = $$shop.inputs.placeArtifactFx

sample({
  clock: placeButtonPressed,
  fn(id) {
    return { id, price: '1000' }
  },
  target: placeToMarketFx,
})

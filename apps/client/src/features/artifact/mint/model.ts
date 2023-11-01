import { createEvent, sample } from 'effector'
import { $$shop } from '@/shared/ethereum'

export const mintButtonClicked = createEvent()

export const $loading = $$shop.inputs.buyArtifactFx.pending

sample({
  clock: mintButtonClicked,
  target: $$shop.inputs.buyArtifactFx,
})

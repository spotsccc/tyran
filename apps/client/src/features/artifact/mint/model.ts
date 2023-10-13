import { createEvent, sample } from 'effector'
import { $$shop } from '@/shared/ethereum'

export const minButtonClicked = createEvent()

export const $loading = $$shop.inputs.buyArtifactFx.pending

sample({
  clock: minButtonClicked,
  target: $$shop.inputs.buyArtifactFx,
})

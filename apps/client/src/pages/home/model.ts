import { createEvent, sample } from 'effector'
import { $$account } from '@/shared/ethereum'

export const connectButtonClicked = createEvent()

export const connectAccountButtonClicked = createEvent()

sample({
  clock: connectAccountButtonClicked,
  target: $$account.inputs.connect,
})

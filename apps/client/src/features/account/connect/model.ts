import { createEvent, createStore, sample, Store } from 'effector'
import { modelFactory } from 'effector-factorio'
import { or } from 'patronum'
import { $$account } from '@/shared/ethereum'

type Config = {
  $shouldShow: Store<boolean>
}

export const factory = modelFactory(({ $shouldShow }: Config) => {
  const $connecting = createStore(false)
  const $isOpened = or($connecting, $shouldShow)

  const connectAccountButtonClicked = createEvent()

  sample({
    clock: connectAccountButtonClicked,
    fn: () => true,
    target: [$$account.inputs.connect, $connecting],
  })

  sample({
    clock: $$account.outputs.connectionFinished,
    fn: () => false,
    target: $connecting,
  })

  return {
    $isOpened,
    connectAccountButtonClicked,
  }
})

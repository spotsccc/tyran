import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { ProviderNotInitializedError } from '../errors'
import { $$provider } from './provider'

export enum AccountState {
  notStarted = 'notStarted',
  checking = 'checking',
  checkConnected = 'checkConnected',
  checkNotConnected = 'checkNotConnected',
  checkingFailed = 'checkingFailed',
  connecting = 'connecting',
  connected = 'connected',
  connectionFailed = 'connectionFailed',
}

const $selected = createStore<JsonRpcSigner | null>(null)
const $error = createStore<Error | null>(null)
const $state = createStore(AccountState.notStarted)

const connect = createEvent()
const check = createEvent()

const checkIsConnectedFx = attach({
  effect: createEffect(
    async ({ provider }: { provider: BrowserProvider | null }) => {
      if (!provider) {
        throw new ProviderNotInitializedError('Provider not initialized!')
      }
      const accounts = await provider.listAccounts()
      return accounts.length > 0
    },
  ),
  source: {
    provider: $$provider.outputs.$instance,
  },
})

const connectAccountFx = attach({
  effect: createEffect(
    async ({ provider }: { provider: BrowserProvider | null }) => {
      if (!provider) {
        throw new ProviderNotInitializedError(
          'Connect account.ts before provider initialized!',
        )
      }

      return await provider.getSigner()
    },
  ),
  source: {
    provider: $$provider.outputs.$instance,
  },
})

sample({
  clock: connect,
  target: connectAccountFx,
})

sample({
  clock: connectAccountFx.doneData,
  target: [$selected, $error.reinit!],
})

sample({
  clock: connectAccountFx.doneData,
  fn: () => AccountState.connected,
  target: $state,
})

sample({
  clock: connectAccountFx.failData,
  target: $error,
})

sample({
  clock: connectAccountFx.failData,
  fn: () => AccountState.connectionFailed,
  target: $state,
})

sample({
  clock: check,
  target: checkIsConnectedFx,
})

sample({
  clock: checkIsConnectedFx.doneData,
  target: $error.reinit!,
})

sample({
  clock: checkIsConnectedFx.doneData,
  filter: (isConnected) => !isConnected,
  fn: () => AccountState.checkNotConnected,
  target: $state,
})

sample({
  clock: checkIsConnectedFx.doneData,
  filter: (isConnected) => isConnected,
  fn: () => AccountState.checkConnected,
  target: $state,
})

sample({
  clock: checkIsConnectedFx.failData,
  target: $error,
})

sample({
  clock: checkIsConnectedFx.failData,
  fn: () => AccountState.connectionFailed,
  target: $state,
})

sample({
  clock: connect,
  fn: () => AccountState.connecting,
  target: $state,
})

sample({
  clock: check,
  fn: () => AccountState.checking,
  target: $state,
})

sample({
  clock: checkIsConnectedFx.failData,
  fn: () => AccountState.checkingFailed,
  target: $state,
})

export const $$account = {
  inputs: {
    connect,
    check,
  },
  outputs: {
    $selected,
    $error,
    $state,
    connectionFinished: connectAccountFx.doneData,
    connectionFailed: connectAccountFx.failData,
    checkFinished: checkIsConnectedFx.doneData,
    checkFailed: checkIsConnectedFx.failData,
  },
}

import {
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from 'effector'
import { BrowserProvider, Eip1193Provider, ethers } from 'ethers'
import { MetaMaskNotInstalledError, WrongNetworkError } from '../errors'

export enum ProviderState {
  notStarted = 'notStarted',
  inProgress = 'inProgress',
  success = 'success',
  failed = 'failed',
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider & BrowserProvider
  }
}

const HARDHAT_NETWORK_ID = 31337

const $instance = createStore<BrowserProvider | null>(null)
const $error = createStore<Error | null>(null)
const $state = createStore(ProviderState.notStarted)

const init = createEvent()
const accountChanged = createEvent()
const networkChanged = createEvent()

const initializeProviderFx = createEffect(async () => {
  const ethereum = window.ethereum
  if (!ethereum) {
    throw new MetaMaskNotInstalledError('Metamask not installed!')
  }
  const provider = new ethers.BrowserProvider(ethereum)
  const network = await getNetworkFx({ provider })
  if (network.chainId !== BigInt(HARDHAT_NETWORK_ID)) {
    throw new WrongNetworkError(
      'Network chain id is not same as hardhat network id',
    )
  }
  const accountChangedBound = scopeBind(accountChanged)
  const networkChangedBound = scopeBind(networkChanged)
  await ethereum.on('accountsChanged', accountChangedBound)
  await ethereum.on('chainChanged', networkChangedBound)
  return provider
})

const getNetworkFx = createEffect(
  async ({ provider }: { provider: BrowserProvider }) => {
    return await provider.getNetwork()
  },
)

sample({
  clock: init,
  target: initializeProviderFx,
})

sample({
  clock: init,
  fn: () => ProviderState.inProgress,
  target: $state,
})

sample({
  clock: initializeProviderFx.failData,
  target: $error,
})

sample({
  clock: initializeProviderFx.failData,
  fn: () => ProviderState.failed,
  target: $state,
})

sample({
  clock: initializeProviderFx.doneData,
  target: [$instance, $error.reinit!],
})

sample({
  clock: initializeProviderFx.doneData,
  fn: () => ProviderState.success,
  target: $state,
})

export const $$provider = {
  inputs: {
    init,
  },
  outputs: {
    $state,
    $instance,
    $error,
    initializationFinished: initializeProviderFx.doneData,
    initializationFailed: initializeProviderFx.failData,
    networkChanged,
    accountChanged,
  },
}

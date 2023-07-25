import { BrowserProvider, Eip1193Provider, ethers, JsonRpcSigner } from 'ethers'
import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from 'effector'
import { appStarted } from '../events'
import {
  MetaMaskNotInstalledError,
  ProviderNotInitializedError,
  WrongNetworkError,
} from './errors'

declare global {
  interface Window {
    ethereum?: Eip1193Provider & BrowserProvider
  }
}

const HARDHAT_NETWORK_ID = 31337
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

export const $provider = createStore<BrowserProvider | null>(null)
export const $selectedAccount = createStore<JsonRpcSigner | null>(null)
export const $error = createStore<Error | null>(null)

export const accountChanged = createEvent()
export const networkChanged = createEvent()
export const accountConnected = createEvent()

export const initializeProviderFx = createEffect(async () => {
  const ethereum = window.ethereum
  if (!ethereum) {
    throw new MetaMaskNotInstalledError('Metamask not installed!')
  }
  const provider = new ethers.BrowserProvider(ethereum)
  const network = await provider.getNetwork()
  if (network.chainId !== BigInt(HARDHAT_NETWORK_ID)) {
    throw new WrongNetworkError(
      'Network chain id is not same as hardhat network id',
    )
  }
  return provider
})

export const initializeListenersFx = createEffect(() => {
  const ethereum = window.ethereum
  if (!ethereum) {
    throw new MetaMaskNotInstalledError('Metamask not installed!')
  }
  const accountChangedBound = scopeBind(accountChanged)
  const networkChangedBound = scopeBind(networkChanged)
  ethereum.on('accountsChanged', () => {
    accountChangedBound()
  })
  ethereum.on('chainChanged', () => {
    networkChangedBound()
  })
})

export const checkIsConnectedFx = attach({
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
    provider: $provider,
  },
})

export const connectAccountFx = attach({
  effect: createEffect(
    async ({ provider }: { provider: BrowserProvider | null }) => {
      if (!provider) {
        throw new ProviderNotInitializedError('Provider not initialized!')
      }

      return provider.getSigner()
    },
  ),
  source: {
    provider: $provider,
  },
})

// ———————————————— initialize metamask provider ————————————————
sample({
  clock: [appStarted, networkChanged],
  target: initializeProviderFx,
})

sample({
  clock: initializeProviderFx.failData,
  target: $error,
})

sample({
  clock: initializeProviderFx.doneData,
  target: $provider,
})

// ———————————————— initialize listeners ————————————————
sample({
  clock: initializeProviderFx.doneData,
  target: initializeListenersFx,
})

sample({
  clock: initializeListenersFx.failData,
  target: $error,
})

// ———————————————— check is account already connected ————————————————
sample({
  clock: initializeProviderFx.doneData,
  target: checkIsConnectedFx,
})

sample({
  clock: checkIsConnectedFx.doneData,
  filter: Boolean,
  target: connectAccountFx,
})

// ———————————————— connect account ————————————————
sample({
  clock: [accountChanged, accountConnected],
  target: connectAccountFx,
})

sample({
  clock: connectAccountFx.doneData,
  target: $selectedAccount,
})

sample({
  clock: connectAccountFx.failData,
  target: $error,
})

// ———————————————— reset stores after network changed ————————————————

sample({
  clock: networkChanged,
  target: [$provider.reinit, $selectedAccount.reinit, $error.reinit],
})

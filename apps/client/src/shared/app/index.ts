import { combine, createEvent, sample } from 'effector'
import { accountConnectedMutation, getUserQuery } from '@/shared/api/users'
import { $$account, $$provider, $$shop } from '@/shared/ethereum'
import { AccountState } from '@/shared/ethereum/model/account'
import { ProviderState } from '@/shared/ethereum/model/provider'

export enum AppState {
  notStarted = 'notStarted',
  providerInProgress = 'providerInProgress',
  providerFailed = 'providerFailed',
  providerSucceeded = 'providerSucceeded',
  accountChecking = 'accountChecking',
  accountCheckingFailed = 'accountCheckingFailed',
  accountCheckConnected = 'accountCheckConnected',
  accountCheckNotConnected = 'accountCheckNotConnected',
  accountConnecting = 'accountConnecting',
  accountConnected = 'accountConnected',
  accountConnectingFailed = 'accountConnectingFailed',
}

export enum ShopState {
  notStarted = 'notStarted',
  inProgress = 'inProgress',
  success = 'success',
  failed = 'failed',
}

const STATE_MAPPING = {
  [ProviderState.success]: {
    [AccountState.notStarted]: AppState.providerSucceeded,
    [AccountState.checking]: AppState.accountChecking,
    [AccountState.checkNotConnected]: AppState.accountCheckNotConnected,
    [AccountState.checkConnected]: AppState.accountCheckConnected,
    [AccountState.checkingFailed]: AppState.accountCheckingFailed,
    [AccountState.connecting]: AppState.accountConnecting,
    [AccountState.connected]: AppState.accountConnected,
    [AccountState.connectionFailed]: AppState.accountConnectingFailed,
  },
  [ProviderState.failed]: {
    [AccountState.notStarted]: AppState.providerFailed,
    [AccountState.checking]: AppState.providerFailed,
    [AccountState.checkNotConnected]: AppState.providerFailed,
    [AccountState.checkConnected]: AppState.providerFailed,
    [AccountState.checkingFailed]: AppState.providerFailed,
    [AccountState.connecting]: AppState.providerFailed,
    [AccountState.connected]: AppState.providerFailed,
    [AccountState.connectionFailed]: AppState.providerFailed,
  },
  [ProviderState.inProgress]: {
    [AccountState.notStarted]: AppState.providerInProgress,
    [AccountState.checking]: AppState.providerInProgress,
    [AccountState.checkNotConnected]: AppState.providerInProgress,
    [AccountState.checkConnected]: AppState.providerInProgress,
    [AccountState.checkingFailed]: AppState.providerInProgress,
    [AccountState.connecting]: AppState.providerInProgress,
    [AccountState.connected]: AppState.providerInProgress,
    [AccountState.connectionFailed]: AppState.providerInProgress,
  },
  [ProviderState.notStarted]: {
    [AccountState.notStarted]: AppState.notStarted,
    [AccountState.checking]: AppState.notStarted,
    [AccountState.checkNotConnected]: AppState.notStarted,
    [AccountState.checkConnected]: AppState.notStarted,
    [AccountState.checkingFailed]: AppState.notStarted,
    [AccountState.connecting]: AppState.notStarted,
    [AccountState.connected]: AppState.notStarted,
    [AccountState.connectionFailed]: AppState.notStarted,
  },
}

export const started = createEvent()
export const $appState = combine(
  {
    provider: $$provider.outputs.$state,
    account: $$account.outputs.$state,
  },
  ({ provider, account }) => {
    return STATE_MAPPING[provider][account]
  },
)
export const $error = combine(
  {
    provider: $$provider.outputs.$error,
    account: $$account.outputs.$error,
    shop: $$shop.outputs.$error,
  },
  ({ provider }) => {
    return provider
  },
)

sample({
  clock: [started, $$provider.outputs.networkChanged],
  target: $$provider.inputs.init,
})

sample({
  clock: [
    $$provider.outputs.initializationFinished,
    $$provider.outputs.accountChanged,
  ],
  target: $$account.inputs.check,
})

sample({
  clock: $$account.outputs.checkFinished,
  filter: (checkResult) => checkResult,
  target: $$account.inputs.connect,
})

sample({
  clock: $$account.outputs.connectionFinished,
  target: $$shop.inputs.init,
})

sample({
  clock: $$account.outputs.connectionFinished,
  fn: (signer) => ({
    address: signer.address,
  }),
  target: getUserQuery.start,
})

sample({
  clock: getUserQuery.finished.failure,
  source: $$account.outputs.$selected,
  filter: (_, res) => Boolean(res),
  fn: (account) => ({ address: account?.address as string }),
  target: accountConnectedMutation.start,
})

sample({
  clock: accountConnectedMutation.finished.success,
  source: $$account.outputs.$selected,
  filter: (_, res) => Boolean(res),
  fn: (account) => ({ address: account?.address as string }),
  target: getUserQuery.start,
})

export const $$app = {
  inputs: {
    started,
  },
  outputs: {
    $error,
    $state: $appState,
  },
}

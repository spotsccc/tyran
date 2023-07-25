import { reflect } from '@effector/reflect'
import { connectButtonClicked } from '../model'
import { WalletConnectionView } from '../ui/wallet-connection'
import { $provider, $selectedAccount } from '../../../shared/ethereum'
import { not } from 'patronum'

export const WalletConnection = reflect({
  view: WalletConnectionView,
  bind: {
    selectedAddress: $selectedAccount.map(
      (account) => account?.address ?? null,
    ),
    shouldShowPlaceholder: not($provider.map(Boolean)),
    connected: $selectedAccount.map(Boolean),
    onConnectButtonClicked: connectButtonClicked,
  },
})

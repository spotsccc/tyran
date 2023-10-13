import { reflect } from '@effector/reflect'
import { not } from 'patronum'
import { $instance, $selectedAccount } from '../../../shared/ethereum'
import { connectButtonClicked } from '../model'
import { WalletConnectionView } from '../ui/wallet-connection'

export const WalletConnection = reflect({
  view: WalletConnectionView,
  bind: {
    selectedAddress: $selectedAccount.map(
      (account) => account?.address ?? null,
    ),
    shouldShowPlaceholder: not($instance.map(Boolean)),
    connected: $selectedAccount.map(Boolean),
    onConnectButtonClicked: connectButtonClicked,
  },
})

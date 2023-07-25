import { WalletConnection } from './wallet-connection'
import { NetworkErrorMessage } from './network-error-message'
import { useUnit } from 'effector-react'
import { $error } from '../../../shared/ethereum/model'

export function HomePage() {
  const { error } = useUnit({ error: $error })
  return (
    <div>
      <WalletConnection />
      {Boolean(error) && <NetworkErrorMessage />}
    </div>
  )
}

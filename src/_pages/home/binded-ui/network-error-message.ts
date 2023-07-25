import { reflect } from '@effector/reflect'
import { NetworkErrorMessageView } from '../ui/network-error-message'
import { $error } from '../../../shared/ethereum/model'
import {
  MetaMaskNotInstalledError,
  ProviderNotInitializedError,
  WrongNetworkError,
} from '../../../shared/ethereum'

export const NetworkErrorMessage = reflect({
  view: NetworkErrorMessageView,
  bind: {
    message: $error.map((error) => {
      switch (true) {
        case error instanceof MetaMaskNotInstalledError:
          return 'MetaMask not installed. Please install metamask to continue.'
        case error instanceof WrongNetworkError:
          return 'You tried to use network which network id is not equal to hardhat. You should use hardhat network.'
        case error instanceof ProviderNotInitializedError:
        default:
          return "Something went wrong. It's not your fault. Try to do it again or connect us"
      }
    }),
    onClose: () => console.log('close'),
  },
})

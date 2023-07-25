type Props = {
  selectedAddress: string | null
  onConnectButtonClicked: () => void
  shouldShowPlaceholder: boolean
  connected: boolean
}

export function WalletConnectionView({
  selectedAddress,
  onConnectButtonClicked,
  connected,
  shouldShowPlaceholder,
}: Props) {
  if (shouldShowPlaceholder) {
    return <div>placeholder</div>
  }
  if (!connected) {
    return (
      <div>
        You are not connected to metamask
        <button onClick={onConnectButtonClicked}>connect to metamask</button>
      </div>
    )
  }
  return <div>your account: {selectedAddress}</div>
}

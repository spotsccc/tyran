import { modelView } from 'effector-factorio'
import { useUnit } from 'effector-react'
import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal/ui'
import { factory } from './model'

export const ConnectAccountModal = modelView(factory, () => {
  const { $isOpened, connectAccountButtonClicked } = factory.useModel()
  const { isOpened, connectAccount } = useUnit({
    isOpened: $isOpened,
    connectAccount: connectAccountButtonClicked,
  })
  return (
    <Modal
      Content={
        <div>
          <Button title="Connect account" onClick={connectAccount} />
        </div>
      }
      isOpened={isOpened}
      close={() => {}}
    />
  )
})

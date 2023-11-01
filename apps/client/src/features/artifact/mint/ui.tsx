import { Button } from '@/shared/ui/button'
import { $loading, mintButtonClicked } from './model'
import { useUnit } from 'effector-react'
import { cx } from 'class-variance-authority'

export type MintArtifactProps = {
  className?: string
}

export function MintArtifact({ className }: MintArtifactProps) {
  const { onClick } = useUnit({ onClick: mintButtonClicked })
  return (
    <Button
      onClick={onClick}
      className={cx(className, 'bg-base-white text-base-black')}
    >
      GENERATE NFT
    </Button>
  )
}

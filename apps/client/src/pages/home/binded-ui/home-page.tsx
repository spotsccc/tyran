import { useUnit } from 'effector-react'
import { MintArtifact } from '@/features/artifact/mint/ui'
import { $$ethereum } from '@/shared/ethereum'
import { connectAccountButtonClicked } from '../model'

export function HomePage() {
  return (
    <div>
      <MintArtifact />
    </div>
  )
}

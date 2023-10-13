import { reflect } from '@effector/reflect'
import { voidFn } from '@/shared/lib/void'
import { Button } from '@/shared/ui/button'
import { $loading, minButtonClicked } from './model'

export const MintArtifact = reflect({
  view: Button,
  bind: {
    title: 'Buy artifacts',
    type: 'primary',
    color: 'blue',
    size: 'sm',
    onClick: minButtonClicked.prepend(voidFn),
    disabled: $loading,
  },
})

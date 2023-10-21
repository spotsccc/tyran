import { Artifact } from 'api-contract'
import { Store } from 'effector'
import { ArtifactCardById } from './card-by-id'
import { FC } from 'react'
import { cx } from 'class-variance-authority'

export type ArtifactListProps = {
  ids: Array<string>
  $artifacts: Store<Record<string, Artifact>>
  className?: string
  Slot?: FC
}

export function ArtifactList({
  ids,
  $artifacts,
  className,
  Slot,
}: ArtifactListProps) {
  return (
    <div
      className={cx(
        className,
        'grid gap-x-5 gap-y-7 grid-cols-1 min-[500px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-4',
      )}
    >
      {ids.map((id) => (
        <ArtifactCardById key={id} id={id} $artifacts={$artifacts} />
      ))}
      {Slot && <Slot />}
    </div>
  )
}

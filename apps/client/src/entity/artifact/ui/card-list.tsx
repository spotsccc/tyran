import { Artifact } from 'api-contract'
import { Store } from 'effector'
import { ArtifactCardById } from './card-by-id'
import { ArtifactCardPlaceholder } from './card-placeholder'

export type ArtifactListProps = {
  ids: Array<string>
  $artifacts: Store<Record<string, Artifact>>
  className?: string
  shouldShowPlaceholder?: boolean
  placeholderCount?: number
  shouldShowInfiniteScrollElement?: boolean
  infiniteScrollElementRef?: (node: HTMLElement | null) => void
}

export function ArtifactList({
  ids,
  $artifacts,
  className,
  shouldShowPlaceholder,
  placeholderCount,
  shouldShowInfiniteScrollElement,
  infiniteScrollElementRef,
}: ArtifactListProps) {
  return (
    <div className={className}>
      {ids.map((id) => (
        <ArtifactCardById key={id} id={id} $artifacts={$artifacts} />
      ))}
      {shouldShowPlaceholder && placeholderCount && (
        <Placeholder count={placeholderCount} />
      )}
      {shouldShowInfiniteScrollElement && (
        <div ref={infiniteScrollElementRef} />
      )}
    </div>
  )
}

type PlaceholderProps = {
  count: number
}

function Placeholder({ count }: PlaceholderProps) {
  const arr = new Array(count).fill(null)
  return (
    <>
      {arr.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ArtifactCardPlaceholder key={index} />
      ))}
    </>
  )
}

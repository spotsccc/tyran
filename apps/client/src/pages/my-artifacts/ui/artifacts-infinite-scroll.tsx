import { useUnit } from 'effector-react'
import { useCallback } from 'react'
import { ArtifactList } from '@/entity/artifact'
import { getArtifactsQuery } from '@/shared/api'
import {
  $artifactsEntities,
  $artifactsIds,
  $loading,
  observerCreated,
} from '../model'

export function ArtifactsInfiniteScroll() {
  const { loading, createObserver, ids, error } = useUnit({
    loading: $loading,
    createObserver: observerCreated,
    ids: $artifactsIds,
    error: getArtifactsQuery.$error,
  })
  const measuredRef = useCallback(
    (node: HTMLElement | null) => {
      if (node !== null) {
        createObserver(node)
      }
    },
    [createObserver],
  )
  return (
    <ArtifactList
      ids={ids}
      $artifacts={$artifactsEntities}
      className="grid grid-cols-2 gap-6 w-full px-5 py-4"
      shouldShowPlaceholder={loading}
      placeholderCount={10}
      infiniteScrollElementRef={measuredRef}
      shouldShowInfiniteScrollElement={!loading && error === null}
    />
  )
}

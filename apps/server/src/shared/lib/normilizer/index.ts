import { Artifact, Lot } from 'api-contract'

type NormalizedEntity<Entity extends { id: string | number }> = {
  ids: Array<Entity['id']>
  entities: Record<Entity['id'], Entity>
}

export function normalizeArtifacts({
  artifacts,
}: {
  artifacts: Array<Artifact>
}): NormalizedEntity<Artifact> {
  return {
    ids: artifacts.map(({ id }) => id),
    entities: artifacts.reduce(
      (acc, artifact) => ({ ...acc, [artifact.id]: artifact }),
      {},
    ),
  }
}

export function normalizeLots({
  lots,
}: {
  lots: Array<Lot>
}): NormalizedEntity<Lot> {
  return {
    ids: lots.map(({ artifactId }) => artifactId),
    entities: lots.reduce(
      (acc, lot) => ({ ...acc, [lot.artifactId]: lot }),
      {},
    ),
  }
}

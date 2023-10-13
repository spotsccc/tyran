export type NormalizedEntity<Entity extends { id: string | number }> = {
  ids: Array<Entity['id']>
  entities: Record<Entity['id'], Entity>
}

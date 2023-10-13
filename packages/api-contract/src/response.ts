import type { Artifact } from './artifact'
import type { Lot } from './lot'
import type { NormalizedEntity } from './normalized-entity'

export type SuccessResponse<Data> = { data: Data }
export type ErrorResponse = { message: string; code: number }

export type Response<Data> = SuccessResponse<Data> | ErrorResponse

export function createSuccessResponse<T>({
  data,
}: {
  data: T
}): SuccessResponse<T> {
  return {
    data,
  }
}

export function createErrorResponse({
  message,
  code,
}: {
  message: string
  code: number
}): ErrorResponse {
  return { message, code }
}

export type GetLotsData = {
  lots: NormalizedEntity<Lot>
  artifacts: NormalizedEntity<Artifact>
}

export type GetLotsResponse = Response<GetLotsData>

export type GetArtifactsData = {
  artifacts: NormalizedEntity<Artifact>
  lots: NormalizedEntity<Lot>
}

export type GetArtifactsResponse = Response<GetArtifactsData>

export type GetArtifactData = {
  artifact: Artifact
  lot: Lot | null
}

export type GetArtifactResponse = Response<GetArtifactData>

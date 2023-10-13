import { sample } from 'effector'
import { getArtifactQuery } from '@/shared/api/get-artifact'
import { artifactRoute } from '@/shared/router'

sample({
  clock: artifactRoute.opened,
  source: artifactRoute.$params,
  target: getArtifactQuery.start,
})

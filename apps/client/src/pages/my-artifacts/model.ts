import { createEvent, createStore, sample } from 'effector'
import { or } from 'patronum'
import { getArtifactsQuery } from '@/shared/api'
import { $$account, AccountState } from '@/shared/ethereum'
import { createPageReady } from '@/shared/lib/page-ready'
import { artifactRoute, myArtifactRoute } from '@/shared/router'
import { uploadAvatarMutation } from '@/shared/api/users'
import { artifactFeed } from '@/widgets/artifact/feed'

export const searchButtonClicked = createEvent()
export const fileLoaded = createEvent<File>()

export const $avatarFile = createStore<File | null>(null)
export const uploadButtonClicked = createEvent()

export const $loading = or(
  getArtifactsQuery.$pending,
  getArtifactsQuery.$status.map((status) => status === 'initial'),
)

const pageReady = createPageReady({
  filter: $$account.outputs.$state.map(
    (state) => state === AccountState.connected,
  ),
  route: myArtifactRoute,
  clock: $$account.outputs.connectionFinished,
})

export const artifactsFeedModel = artifactFeed.factory.createModel({
  query: getArtifactsQuery,
  route: artifactRoute,
})

sample({
  clock: fileLoaded,
  target: $avatarFile,
})

sample({
  clock: [searchButtonClicked, pageReady],
  target: artifactsFeedModel.start,
})

sample({
  clock: uploadButtonClicked,
  source: {
    address: $$account.outputs.$selected.map((selected) => selected?.address!),
    file: $avatarFile.map((file) => file!),
  },
  target: uploadAvatarMutation.start,
})

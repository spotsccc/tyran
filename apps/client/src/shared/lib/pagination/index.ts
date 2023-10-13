import { Query } from '@farfetched/core'
import { createEvent, createStore, sample, Store, Unit } from 'effector'
import { and, not } from 'patronum'

export function createPagination<
  Params extends { offset: number; count: number },
  Data,
  Error,
>({
  query,
  append,
  initialState,
  reset,
  count,
  $params,
  checkIsEnded,
}: {
  count: number
  query: Query<Params, Data, Error>
  append: (acc: Data, next: Data) => Data
  checkIsEnded: (data: Data) => boolean
  initialState: Data
  $params: Store<Omit<Params, 'offset' | 'count'>>
  reset: Array<Unit<unknown>>
}) {
  const $data = createStore<Data>(initialState)
  const $offset = createStore(0)
  const $paginationFinished = createStore(false)
  const $shouldReset = createStore(false)

  const load = createEvent()
  const initialLoad = createEvent()

  /* reset start */
  sample({
    clock: [...reset, initialLoad],
    fn: () => true,
    target: $shouldReset,
  })

  sample({
    clock: [...reset, initialLoad],
    target: [$offset.reinit!, $paginationFinished.reinit!],
  })

  sample({
    clock: [load, initialLoad],
    filter: $shouldReset,
    target: $data.reinit!,
  })

  sample({
    clock: query.finished.success,
    target: $shouldReset.reinit!,
  })
  /* reset end */

  /* load more start */
  sample({
    clock: [load, initialLoad],
    source: {
      offset: $offset,
      params: $params,
    },
    filter: and(not(query.$pending), not($paginationFinished)),
    fn({ offset, params }) {
      return { offset, count, ...params } as Params
    },
    target: query.start,
  })

  sample({
    clock: query.finished.success,
    source: {
      data: $data,
    },
    fn: ({ data }, { result }) => append(data, result),
    target: $data,
  })

  sample({
    clock: query.finished.success,
    source: {
      offset: $offset,
    },
    fn({ offset }) {
      return offset + count
    },
    target: $offset,
  })

  sample({
    clock: query.finished.success,
    filter: ({ result }) => checkIsEnded(result),
    fn: () => true,
    target: $paginationFinished,
  })
  /* load more end */

  return {
    $data,
    initialLoad,
    load,
  }
}

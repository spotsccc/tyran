import { Query } from '@farfetched/core'
import { Event, Store, createEvent, createStore, sample } from 'effector'
import { and, not } from 'patronum'

export type PaginationModel<
  Params extends { offset: number; count: number },
  Data,
> = {
  start: Event<Omit<Params, 'offset' | 'count'>>
  next: Event<Omit<Params, 'offset' | 'count'>>
  specific: Event<Params>
  $data: Store<Data>
  $hasNext: Store<boolean>
  $offset: Store<number>
}

export function createPagination<
  Params extends { offset: number; count: number },
  Data,
  Error,
>({
  query,
  append,
  count,
  isHasNext,
}: {
  count: number
  query: Query<Params, Data, Error, Data>
  append: (acc: Data, next: Data) => Data
  isHasNext: (data: Data) => boolean
}): PaginationModel<Params, Data> {
  // eslint-disable-next-line effector/no-getState
  const $data = createStore<Data>(query.$data.getState() as Data)
  const $offset = createStore(0)
  const $hasNext = createStore(true)

  const next = createEvent<Omit<Params, 'count' | 'offset'>>()
  const start = createEvent<Omit<Params, 'count' | 'offset'>>()
  const specific = createEvent<Params>()

  sample({
    clock: start,
    target: [$offset.reinit!, $data.reinit!],
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  sample({
    clock: [start, next],
    source: {
      offset: $offset,
    },
    filter: and(not(query.$pending), $hasNext),
    fn({ offset }, params) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
    fn({ params }) {
      return params.offset + params.count
    },
    target: $offset,
  })

  sample({
    clock: query.finished.success,
    fn: ({ result }) => isHasNext(result),
    target: $hasNext,
  })

  return {
    start,
    $data,
    next,
    $offset,
    $hasNext,
    specific,
  }
}

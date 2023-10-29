import { Store, Event, createEvent, createStore, sample } from 'effector'
import { PaginationModel } from '.'

export type PaginationWithParamsModel<
  Params extends { count: number; offset: number },
  Data,
> = Omit<PaginationModel<Params, Data>, 'start' | 'next'> & {
  start: Event<void>
  next: Event<void>
}

export function withParams<
  Params extends { count: number; offset: number },
  Data,
>({
  pagination,
  $params,
}: {
  pagination: PaginationModel<Params, Data>
  $params: Store<Omit<Params, 'offset' | 'count'>>
}): PaginationWithParamsModel<Params, Data> {
  //eslint-disable-next-line effector/no-getState
  const $appliedParams = createStore($params.getState())
  const next = createEvent()
  const start = createEvent()

  sample({
    clock: start,
    source: $params,
    target: $appliedParams,
  })

  sample({
    clock: start,
    source: $appliedParams,
    target: pagination.start,
  })

  sample({
    clock: next,
    source: $appliedParams,
    target: pagination.next,
  })

  return {
    ...pagination,
    start,
    next,
  }
}

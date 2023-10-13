import { sample, Store } from 'effector'
import { Filter } from '@/shared/lib/filter'
import { controls, myArtifactRoute } from '@/shared/router'

export function syncQuery<T extends string>({
  $filter,
  name,
}: {
  name: string
  $filter: Store<Array<Filter<T>>>
}) {
  sample({
    clock: $filter,
    source: controls.$query,
    filter: myArtifactRoute.$isOpened,
    fn(query, filter) {
      return { ...query, [name]: filter.map(({ id }) => id) }
    },
    target: controls.$query,
  })

  sample({
    clock: controls.$query,
    source: {
      filter: $filter,
      isOpened: myArtifactRoute.$isOpened,
    },
    filter({ filter, isOpened }, query) {
      let newFilters: Array<Filter<T>> = []
      if (Array.isArray(query[name])) {
        newFilters = query[name].map((param: T) => ({
          id: param,
          title: param,
        }))
      }
      if (typeof query[name] === 'string') {
        newFilters = query[name]
          .split(',')
          .filter((param: T) => param.length > 0)
          .map((param: T) => ({
            id: param,
            title: param,
          }))
      }
      return (
        isOpened &&
        newFilters.length > 0 &&
        newFilters.some(
          (newCondition) =>
            filter.findIndex(
              (condition) => condition.id === newCondition.id,
            ) === -1,
        )
      )
    },
    fn(_, query) {
      if (Array.isArray(query[name])) {
        return query[name].map((param: T) => ({
          id: param,
          title: param,
        }))
      }
      if (typeof query[name] === 'string') {
        return query[name].split(',').map((param: T) => ({
          id: param,
          title: param,
        }))
      }
      return []
    },
    target: $filter,
  })
}

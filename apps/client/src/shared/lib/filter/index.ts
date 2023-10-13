import { createEvent, createStore, sample } from 'effector'

export type Filter<Type> = {
  id: Type
  title: Type
}

export function createFilter<FilterType>() {
  const $filter = createStore<Array<Filter<FilterType>>>([])

  const conditionSelected = createEvent<Filter<FilterType>>()
  const filterCleared = createEvent()

  sample({
    clock: conditionSelected,
    source: $filter,
    fn(filter, selectedCondition) {
      if (filter.findIndex(({ id }) => id === selectedCondition.id) !== -1) {
        return filter.filter(({ id }) => id !== selectedCondition.id)
      }
      return [...filter, selectedCondition]
    },
    target: $filter,
  })

  sample({
    clock: filterCleared,
    target: $filter.reinit!,
  })

  return {
    $filter,
    conditionSelected,
    filterCleared,
  }
}

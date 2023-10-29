import { Event, Store, createEvent, createStore, sample } from 'effector'

export type Condition<Type> = {
  value: Type
}

export type FilterModel<Type> = {
  $filter: Store<Array<Condition<Type>>>
  conditionSelected: Event<Condition<Type>>
  filterCleared: Event<void>
}

export function createFilter<Type>() {
  const $filter = createStore<Array<Condition<Type>>>([])

  const conditionSelected = createEvent<Condition<Type>>()
  const filterCleared = createEvent()

  sample({
    clock: conditionSelected,
    source: $filter,
    fn(filter, selectedCondition) {
      if (
        filter.findIndex(({ value }) => value === selectedCondition.value) !==
        -1
      ) {
        return filter.filter(({ value }) => value !== selectedCondition.value)
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

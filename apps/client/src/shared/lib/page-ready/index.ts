import { RouteInstance } from 'atomic-router'
import { createEvent, Event, sample, Store } from 'effector'

export function createPageReady({
  filter,
  clock,
  route,
}: {
  filter: Store<boolean>
  clock: Event<any>
  route: RouteInstance<any>
}) {
  const pageReady = createEvent()

  sample({
    clock: route.opened,
    filter,
    target: pageReady,
  })

  sample({
    clock,
    filter: route.$isOpened,
    target: pageReady,
  })
  return pageReady
}

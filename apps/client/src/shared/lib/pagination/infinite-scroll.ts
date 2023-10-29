import { Event, sample } from 'effector'
import { createObserver } from '../observer'

export function createInfiniteScroll({ next }: { next: Event<void> }) {
  const { intersect, observerCreated } = createObserver()

  sample({
    clock: intersect,
    filter([intersect]) {
      return intersect.isIntersecting
    },
    target: next,
  })

  return { observerCreated }
}

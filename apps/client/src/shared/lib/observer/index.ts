import {
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from 'effector'

export function createObserver() {
  const $observer = createStore<IntersectionObserver | null>(null)
  const intersect = createEvent<Array<IntersectionObserverEntry>>()
  const observerCreated = createEvent<HTMLElement>()

  const initObserverFx = createEffect(
    ({ element }: { element: HTMLElement }) => {
      const intersectBound = scopeBind(intersect)
      const observer = new IntersectionObserver(intersectBound)
      observer.observe(element)
      return observer
    },
  )

  sample({
    clock: initObserverFx.doneData,
    target: $observer,
  })

  sample({
    clock: observerCreated,
    fn(element) {
      return { element }
    },
    target: initObserverFx,
  })

  return {
    intersect,
    observerCreated,
  }
}

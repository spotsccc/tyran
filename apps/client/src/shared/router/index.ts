import { createRoute, createRouterControls } from 'atomic-router'

export const myArtifactRoute = createRoute()
export const mintRoute = createRoute()
export const connectAccountRoute = createRoute()
export const artifactRoute = createRoute<{ id: string }>()
export const marketRoute = createRoute()
export const controls = createRouterControls()

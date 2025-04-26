import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
// Assuming the components are in a different directory or have different names
import { RootLayout } from './components/RootLayout'
import { HomePage } from './components/HomePage'
// Assuming the components are in a different directory or have different names
import { ChatPage } from './components/ChatPage'
import { ConnectionsPage } from './components/ConnectionsPage'
import { SettingsPage } from './components/SettingsPage'

// Create the root route
export const rootRoute = createRootRoute({
  component: RootLayout,
})

// Create the index route
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Create the chat route
export const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatPage,
})

// Create the connections route
export const connectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/connections',
  component: ConnectionsPage,
})

// Create the settings route
export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

// Create the route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
  connectionsRoute,
  settingsRoute,
]) 
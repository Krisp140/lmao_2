// Add this at the very top, before any React code
if (window.libp2pAPI && typeof window.libp2pAPI.onDirectMessage === 'function') {
    window.libp2pAPI.onDirectMessage((msg) => {
      console.log('Direct message event received at window level:', msg)
    })
  }

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { Libp2pContextProvider } from './context/Libp2pProvider'
import { routeTree } from './routes'
import './index.css'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Create the router
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
})

// Register the router for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create root element
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

const root = createRoot(rootElement)

// Render the app
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Libp2pContextProvider>
        <RouterProvider router={router} />
      </Libp2pContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
) 
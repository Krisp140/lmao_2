import React from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { useLibp2p } from '@/renderer/context/ctx'

export function RootLayout() {
  const { isConnected, peerId, multiaddrs } = useLibp2p()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Libp2p Electron Chat</h1>
          <div className="flex items-center mt-2 md:mt-0 text-sm">
            {isConnected ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="mr-2">Connected</span>
                <span className="font-mono bg-blue-700 px-2 py-1 rounded">{peerId?.slice(0, 10)}...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                activeProps={{ className: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' }}
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/chat" 
                activeProps={{ className: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' }}
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Chat
              </Link>
            </li>
            <li>
              <Link 
                to="/connections" 
                activeProps={{ className: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' }}
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Connections
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                activeProps={{ className: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' }}
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Settings
              </Link>
            </li>
          </ul>

          {isConnected && multiaddrs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">My Addresses</h3>
              <div className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {multiaddrs.map((addr, index) => (
                  <div key={index} className="mb-1">
                    <code className="font-mono break-all">{addr}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>

      <footer className="bg-gray-100 dark:bg-gray-800 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Libp2p Electron Chat - Built with Electron, React, and libp2p
      </footer>
    </div>
  )
} 
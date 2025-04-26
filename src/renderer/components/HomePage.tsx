import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLibp2p } from '@/renderer/context/ctx'

export function HomePage() {
  const navigate = useNavigate()
  const { isConnected, peerId, peers } = useLibp2p()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to Libp2p Electron Chat</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Node Status</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Status:</span>{' '}
              {isConnected ? (
                <span className="text-green-600 dark:text-green-400">Connected</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Disconnected</span>
              )}
            </div>
            {peerId && (
              <div>
                <span className="font-medium">Peer ID:</span>{' '}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-sm">
                  {peerId}
                </code>
              </div>
            )}
            <div>
              <span className="font-medium">Connected Peers:</span>{' '}
              <span className="font-mono">{peers.length}</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col space-y-2">
            <button 
              className="btn"
              onClick={() => navigate({ to: '/chat' })}
            >
              Open Chat
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate({ to: '/connections' })}
            >
              Manage Connections
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="mb-4">
          This is a simple chat application built using Electron and libp2p, demonstrating 
          peer-to-peer communication capabilities without centralized servers.
        </p>
        <h3 className="font-medium mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Direct peer-to-peer messaging</li>
          <li>Topic-based publish/subscribe</li>
          <li>TCP and WebRTC transport protocols</li>
          <li>Circuit relay for NAT traversal</li>
        </ul>
      </div>
    </div>
  )
} 
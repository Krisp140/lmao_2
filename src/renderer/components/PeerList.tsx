import React from 'react'
import { useLibp2p } from '../context/ctx'

interface PeerListProps {
  onSelectPeer?: (peerId: string) => void
}

export function PeerList({ onSelectPeer }: PeerListProps) {
  const { peers } = useLibp2p()
  
  if (peers.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Connected Peers</h3>
        <div className="py-4 text-center text-gray-500">
          No connected peers
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Connected Peers ({peers.length})</h3>
      
      <ul className="divide-y divide-gray-200">
        {peers.map((peerId) => (
          <li key={peerId} className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{peerId}</p>
              </div>
              <div className="ml-2 flex-shrink-0 flex">
                <button
                  onClick={() => onSelectPeer && onSelectPeer(peerId)}
                  className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded"
                >
                  Chat
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(peerId)
                      .then(() => {
                        // Could add a toast notification here
                        console.log('PeerID copied to clipboard')
                      })
                      .catch(err => {
                        console.error('Failed to copy:', err)
                      })
                  }}
                  className="ml-2 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Copy ID
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 
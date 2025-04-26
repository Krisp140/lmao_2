import React, { useState } from 'react'
import { useLibp2p } from '@/renderer/context/ctx'
import { ConnectPeer } from './ConnectPeer'
import { PeerList } from './PeerList'

export function ConnectionsPage() {
  const { isConnected } = useLibp2p()
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null)

  const sampleMultiaddrs = [
    '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
    '/ip4/127.0.0.1/tcp/9090/ws/p2p/12D3KooWMoejJznyDuEk5aJvVNdWbtDRgBPQ5FnUmdqjD5n2m1Fq'
  ]

  const handleSelectPeer = (peerId: string) => {
    setSelectedPeer(peerId)
    // In a real app, we might navigate to a chat view or open a modal
    console.log('Selected peer:', peerId)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Connections</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ConnectPeer onConnect={() => {}} />
          
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Sample Multiaddrs</h2>
            <div className="space-y-2">
              {sampleMultiaddrs.map((addr, index) => (
                <div key={index} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <code className="font-mono text-sm break-all">{addr}</code>
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                    onClick={() => {
                      // In a real implementation, we would call the ConnectPeer component's
                      // setMultiaddr method. For now, we'll just log it.
                      console.log('Selected multiaddr:', addr)
                    }}
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <PeerList onSelectPeer={handleSelectPeer} />
          
          {selectedPeer && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Selected Peer</h3>
              <div className="p-3 bg-gray-100 rounded">
                <code className="font-mono text-sm break-all">{selectedPeer}</code>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Send Message
                </button>
                <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
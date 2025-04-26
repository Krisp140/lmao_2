import React, { useState } from 'react'
import { useLibp2p } from '../context/ctx'

interface ConnectPeerProps {
  onConnect?: (peerId: string) => void
}

export function ConnectPeer({ onConnect }: ConnectPeerProps) {
  const [multiaddr, setMultiaddr] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { connectToPeer } = useLibp2p()
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!multiaddr.trim()) {
      setError('Please enter a valid multiaddr')
      return
    }
    
    setIsConnecting(true)
    setError(null)
    setSuccess(null)
    
    try {
      const result = await connectToPeer(multiaddr.trim())
      if (result && result.success) {
        setSuccess(`Successfully connected to ${multiaddr}`)
        setMultiaddr('')
        
        if (onConnect) {
          onConnect(multiaddr)
        }
      } else {
        setError(result?.error || 'Failed to connect to peer')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to peer')
    } finally {
      setIsConnecting(false)
    }
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Connect to Peer</h3>
      
      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label htmlFor="multiaddr" className="block text-sm font-medium text-gray-700 mb-1">
            Multiaddr
          </label>
          <input
            id="multiaddr"
            type="text"
            value={multiaddr}
            onChange={(e) => setMultiaddr(e.target.value)}
            placeholder="/ip4/127.0.0.1/tcp/10333/p2p/12D3KooWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isConnecting || !multiaddr.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium 
            ${isConnecting || !multiaddr.trim() 
              ? 'bg-indigo-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
    </div>
  )
} 
import React, { useState } from 'react'
import { useLibp2p } from '@/renderer/context/ctx'

export function SettingsPage() {
  const { isConnected, peerId, multiaddrs } = useLibp2p()
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Node Information</h2>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connection Status</h3>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Peer ID</h3>
          {peerId ? (
            <div className="flex items-center">
              <code className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono text-sm break-all flex-1">
                {peerId}
              </code>
              <button 
                className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => copyToClipboard(peerId, 'peerId')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
              {copied === 'peerId' && (
                <span className="ml-2 text-green-600 dark:text-green-400 text-sm">Copied!</span>
              )}
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">Not available</div>
          )}
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">My Addresses</h2>
        
        {multiaddrs.length > 0 ? (
          <div className="space-y-3">
            {multiaddrs.map((addr, index) => (
              <div key={index} className="flex items-center">
                <code className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono text-sm break-all flex-1">
                  {addr}
                </code>
                <button 
                  className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => copyToClipboard(addr, `addr-${index}`)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
                {copied === `addr-${index}` && (
                  <span className="ml-2 text-green-600 dark:text-green-400 text-sm">Copied!</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-400">No addresses available</div>
        )}
      </div>
    </div>
  )
} 
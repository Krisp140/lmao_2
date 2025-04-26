import { createContext, useContext } from 'react'
import type { Libp2p } from '@libp2p/interface'
import type { DirectMessage } from '@/lib/direct-message'

export interface Libp2pType extends Libp2p {
  services: {
    pubsub: any
    directMessage: DirectMessage
    identify: any
    ping: any
    delegatedRouting?: any
  }
}

export interface Message {
  from: string
  to?: string
  topic?: string
  data: string
  timestamp: number
  type?: 'direct' | 'topic'
  sent?: boolean
  content?: string
}

export interface Libp2pContextType {
  isConnected: boolean
  isInitializing: boolean
  error: string | null
  peerId: string | null
  multiaddrs: string[]
  peers: string[]
  messages: Message[]
  connectToPeer: (multiaddr: string) => Promise<{ success: boolean; error?: string }>
  sendDirectMessage: (peerId: string, message: string) => Promise<void>
  publishToTopic: (topic: string, message: string) => Promise<void>
  subscribeToTopic: (topic: string) => Promise<{success: boolean}>
  unsubscribeFromTopic: (topic: string) => Promise<void>
  clearMessages: () => void
}

export const defaultLibp2pContext: Libp2pContextType = {
  isConnected: false,
  isInitializing: true,
  error: null,
  peerId: null,
  multiaddrs: [],
  peers: [],
  messages: [],
  connectToPeer: async () => { throw new Error('Not implemented') },
  sendDirectMessage: async () => { throw new Error('Not implemented') },
  publishToTopic: async () => { throw new Error('Not implemented') },
  subscribeToTopic: async () => { throw new Error('Not implemented') },
  unsubscribeFromTopic: async () => { throw new Error('Not implemented') },
  clearMessages: () => { throw new Error('Not implemented') },
}

export const Libp2pContext = createContext<Libp2pContextType>(defaultLibp2pContext)

export function useLibp2p() {
  const context = useContext(Libp2pContext)
  
  if (context === undefined) {
    throw new Error('useLibp2p must be used within a Libp2pProvider')
  }
  
  return context
} 
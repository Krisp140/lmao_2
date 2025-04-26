import React, { useEffect, useState, useCallback } from 'react'
import { Libp2pContext, Message, defaultLibp2pContext } from './ctx'

// Define libp2pAPI and electron from the preload script
declare global {
  interface Window {
    libp2pAPI: {
      connectToPeer: (multiaddr: string) => Promise<any>
      sendDirectMessage: (peerId: string, message: string) => Promise<any>
      getConnectedPeers: () => Promise<any>
      publishToTopic: (topic: string, message: string) => Promise<any>
      subscribeToTopic: (topic: string) => Promise<any>
      onLibp2pReady: (callback: (data: any) => void) => () => void
      onPeerConnected: (callback: (data: any) => void) => () => void
      onPeerDisconnected: (callback: (data: any) => void) => () => void
      onDirectMessage: (callback: (data: any) => void) => () => void
      onTopicMessage: (callback: (data: any) => void) => () => void
    }
    electron: {
      ipcRenderer: {
        sendMessage: (channel: string, ...args: any[]) => void
        on: (channel: string, callback: (...args: any[]) => void) => void
        once: (channel: string, callback: (...args: any[]) => void) => void
        invoke: (channel: string, ...args: any[]) => Promise<any>
        removeListener: (channel: string, callback: (...args: any[]) => void) => void
        removeAllListeners: (channel: string) => void
      }
    }
  }
}

export function Libp2pContextProvider({ children }: { children: React.ReactNode }) {
  console.debug('Libp2pContextProvider initialized')
  const [state, setState] = useState(defaultLibp2pContext)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize libp2p node
  useEffect(() => {
    console.log('[Libp2pProvider] useEffect running, isInitialized:', isInitialized)
    if (isInitialized) return

    async function initLibp2p() {
      try {
        setState(prev => ({ ...prev, isInitializing: true }))
        
        // Request node initialization from the main process
        // No direct equivalent in libp2pAPI, so skip or implement if needed
        // window.electron.ipcRenderer.sendMessage('init-libp2p')
        // Instead, listen for libp2p-ready event
        const removeReadyListener = window.libp2pAPI.onLibp2pReady((status: any) => {
          setState(prev => ({
            ...prev,
            isInitializing: false,
            isConnected: status.isConnected,
            error: status.error,
            peerId: status.peerId,
            multiaddrs: status.multiaddrs || [],
            peers: status.peers || []
          }))
        })

        // Listen for peer connected/disconnected
        const removePeerConnected = window.libp2pAPI.onPeerConnected((peer: any) => {
          if (typeof peer.id === 'string' && peer.id) {
            setState(prev => ({
              ...prev,
              peers: [...(prev.peers || []), peer.id]
            }))
          }
        })
        const removePeerDisconnected = window.libp2pAPI.onPeerDisconnected((peer: any) => {
          if (typeof peer.id === 'string' && peer.id) {
            setState(prev => ({
              ...prev,
              peers: prev.peers.filter((id: string) => id !== peer.id)
            }))
          }
        })

        // Listen for incoming direct and topic messages
        const removeDirectMessage = window.libp2pAPI.onDirectMessage((message: Message) => {
          console.log('[Libp2pProvider] onDirectMessage callback fired:', message)
          setState(prev => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                ...message,
                timestamp: message.timestamp ?? Date.now(),
              }
            ]
          }))
        })
        const removeTopicMessage = window.libp2pAPI.onTopicMessage((message: Message) => {
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, message]
          }))
        })

        setIsInitialized(true)

        // Cleanup listeners on unmount
        return () => {
          removeReadyListener()
          removePeerConnected()
          removePeerDisconnected()
          removeDirectMessage()
          removeTopicMessage()
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isInitializing: false,
          error: error instanceof Error ? error.message : 'Unknown error initializing libp2p'
        }))
      }
    }

    initLibp2p()
  }, [isInitialized])

  // Connect to a peer
  const connectToPeer = useCallback(async (multiaddr: string) => {
    try {
      const result = await window.libp2pAPI.connectToPeer(multiaddr)
      return result
    } catch (error: any) {
      console.error('Failed to connect to peer:', error)
      return { success: false, error: error?.message || 'Unknown error' }
    }
  }, [])

  // Send a direct message to a peer
  const sendDirectMessage = useCallback(async (peerId: string, message: string) => {
    try {
      await window.libp2pAPI.sendDirectMessage(peerId, message)
      // Add outgoing message to the state
      const outgoingMessage: Message = {
        from: state.peerId || 'me',
        to: peerId,
        data: message,
        timestamp: Date.now(),
        type: 'direct',
        sent: true,
        content: message
      }
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, outgoingMessage]
      }))
    } catch (error) {
      console.error('Failed to send direct message:', error)
      throw error
    }
  }, [state.peerId])

  // Publish a message to a topic
  const publishToTopic = useCallback(async (topic: string, message: string) => {
    try {
      await window.libp2pAPI.publishToTopic(topic, message)
      // Add outgoing message to the state
      const outgoingMessage: Message = {
        from: state.peerId || 'me',
        topic,
        data: message,
        timestamp: Date.now(),
        type: 'topic',
        sent: true,
        content: message
      }
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, outgoingMessage]
      }))
    } catch (error) {
      console.error('Failed to publish to topic:', error)
      throw error
    }
  }, [state.peerId])

  // Subscribe to a topic
  const subscribeToTopic = useCallback(async (topic: string) => {
    try {
      await window.libp2pAPI.subscribeToTopic(topic)
      return { success: true }
    } catch (error) {
      console.error('Failed to subscribe to topic:', error)
      throw error
    }
  }, [])

  // Unsubscribe from a topic
  const unsubscribeFromTopic = useCallback(async (topic: string) => {
    // Not implemented in libp2pAPI, so just log for now
    console.warn('unsubscribeFromTopic not implemented in libp2pAPI')
  }, [])

  // Clear all messages
  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: []
    }))
  }, [])

  // Combine all context values
  const contextValue = {
    ...state,
    connectToPeer,
    sendDirectMessage,
    publishToTopic,
    subscribeToTopic,
    unsubscribeFromTopic,
    clearMessages
  }

  return (
    <Libp2pContext.Provider value={contextValue}>
      {children}
    </Libp2pContext.Provider>
  )
} 
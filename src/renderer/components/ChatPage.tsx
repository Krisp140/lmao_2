import React, { useState, useEffect, useRef } from 'react'
import { useLibp2p, Message } from '@/renderer/context/ctx'

export function ChatPage() {
  const { 
    isConnected, 
    peers, 
    messages, 
    sendDirectMessage, 
    publishToTopic, 
    subscribeToTopic,
    clearMessages 
  } = useLibp2p()
  
  const [message, setMessage] = useState('')
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null)
  const [topic, setTopic] = useState('universal-connectivity-chat-demo')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [activeTab, setActiveTab] = useState<'direct' | 'topic'>('direct')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Effect to subscribe to topic
  useEffect(() => {
    if (isConnected && activeTab === 'topic' && !isSubscribed) {
      handleSubscribe()
    }
  }, [isConnected, activeTab])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    console.log('[ChatPage] messages:', messages)
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      if (activeTab === 'direct' && selectedPeer) {
        await sendDirectMessage(selectedPeer, message)
      } else if (activeTab === 'topic' && isSubscribed) {
        await publishToTopic(topic, message)
      }
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleSubscribe = async () => {
    try {
      const response = await subscribeToTopic(topic)
      if (response.success) {
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
    }
  }

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp || isNaN(timestamp)) {
      return 'now'
    }
    return new Date(timestamp).toLocaleTimeString()
  }

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'direct') {
      // Show all messages where the selected peer is the sender or recipient, and it's not a topic message
      return (
        !msg.topic &&
        (msg.from === selectedPeer || msg.to === selectedPeer)
      )
    } else {
      // Topic messages
      return msg.topic === topic
    }
  })
  useEffect(() => {
    console.log('[ChatPage] filteredMessages:', filteredMessages)
  }, [filteredMessages])


  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setActiveTab('direct')}
          >
            Direct
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${activeTab === 'topic' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setActiveTab('topic')}
          >
            Topic
          </button>
          <button 
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={() => clearMessages()}
          >
            Clear
          </button>
        </div>
      </div>

      {activeTab === 'direct' ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Peer</label>
          <select 
            className="input w-full"
            value={selectedPeer || ''}
            onChange={(e) => setSelectedPeer(e.target.value || null)}
          >
            <option value="">-- Select a Peer --</option>
            {peers.map((peer) => (
              <option key={peer} value={peer}>
                {typeof peer === 'string' ? `${peer.slice(0, 10)}...${peer.slice(-5)}` : 'Unknown'}
              </option>
            ))}
          </select>
          {peers.length === 0 && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              No peers connected. Go to the Connections page to connect to peers.
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Topic</label>
          <div className="flex">
            <input 
              type="text" 
              className="input flex-1 mr-2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isSubscribed}
            />
            <button 
              className="btn"
              onClick={handleSubscribe}
              disabled={!isConnected || isSubscribed}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-y-auto mb-4 p-4">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No messages yet
          </div>
        ) : (
          filteredMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                msg.sent 
                  ? 'ml-auto bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {msg.sent
                  ? 'You'
                  : typeof msg.from === 'string'
                    ? `${msg.from.slice(0, 6)}...`
                    : 'Unknown'}
                {' '}• {formatTimestamp(msg.timestamp)}
              </div>
              <div className="break-words">{msg.content || msg.data}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex">
        <input 
          type="text" 
          className="input flex-1 mr-2"
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={!isConnected || (activeTab === 'direct' && !selectedPeer) || (activeTab === 'topic' && !isSubscribed)}
        />
        <button 
          className="btn"
          onClick={handleSendMessage}
          disabled={!isConnected || !message.trim() || (activeTab === 'direct' && !selectedPeer) || (activeTab === 'topic' && !isSubscribed)}
        >
          Send
        </button>
      </div>
    </div>
  )
}
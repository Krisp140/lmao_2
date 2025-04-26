import type { PeerId, Connection, Stream } from '@libp2p/interface'
import type { Multiaddr } from '@multiformats/multiaddr'

export interface Libp2pPeerConnectionEvent {
  detail: {
    remotePeer: PeerId
    remoteAddr: Multiaddr
    // Additional fields might be present
  }
}

export interface Libp2pPeerDisconnectionEvent {
  detail: {
    remotePeer: PeerId
    // Additional fields might be present
  }
}

export interface Libp2pPubsubMessageEvent {
  detail: {
    topic: string
    from: PeerId
    data: Uint8Array
    // Additional fields might be present
  }
}

export interface StreamWithProtocol extends Stream {
  protocol: string
}

// Define the type rather than extending Connection
export interface ExtendedConnection {
  remotePeer: PeerId
  remoteAddr: Multiaddr
  streams: StreamWithProtocol[]
  protocol?: string
} 
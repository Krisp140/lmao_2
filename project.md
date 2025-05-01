# Libp2p Electron Chat

A peer-to-peer chat application built with Electron, libp2p, TypeScript, React, and Tailwind CSS. This application demonstrates decentralized communication capabilities without relying on centralized servers.

## Features

### Core Networking
- **Libp2p Node Integration**: Full libp2p node running in Electron's main process
- **Peer-to-Peer Connections**: Direct connectivity between peers over TCP
- **WebRTC Circuit Relay**: Fallback connectivity using circuit relay for NAT traversal
- **Multiaddress Support**: Connect to peers using multiaddress format
- **Connection Management**: Automatic connection establishment and maintenance

### Messaging Capabilities
- **Direct Messaging**: Send and receive private messages between peers
- **Topic-Based Messaging**: Publish/subscribe to shared topics for group communication
- **Message History**: Store and display conversation history
- **Reliable Delivery**: Ensure messages reach their destinations when peers are online

### User Interface
- **Modern React UI**: Clean, responsive interface built with React and Tailwind CSS
- **Chat Interface**: Thread-based interface for direct and topic-based messages
- **Peer Management**: UI for connecting to and managing peer connections
- **Settings Configuration**: Configure node options and application preferences
- **Connection Status**: Visual indicators for connection state and peer availability

### Technical Features
- **IPC Communication**: Electron IPC bridge between renderer and main processes
- **Context API**: React Context for state management across components
- **TypeScript**: Full TypeScript support for type safety
- **TanStack Router**: Client-side routing with type safety
- **TanStack Query**: Efficient data fetching and state management

## Architecture

### Main Process (Electron Backend)
- **Libp2p Node**: Core networking capabilities
- **IPC Handlers**: Bridge between frontend and libp2p
- **Direct Message Protocol**: Custom protocol for direct peer communication
- **Event System**: Event-based communication for peer connections and messages

### Renderer Process (React Frontend)
- **Context Providers**: State management for libp2p functionality
- **Component Structure**: Modular UI components
- **Hooks**: Custom hooks for accessing libp2p functionality
- **Routing**: Client-side routing between application pages

### Data Flow
1. **User Actions**: User interacts with the UI
2. **Context API**: Updates state and triggers IPC calls
3. **IPC Bridge**: Communicates between renderer and main processes
4. **Libp2p Node**: Performs networking operations
5. **Event Listeners**: Capture libp2p events and update UI state

## Technical Details

### Libp2p Configuration
- **Transport Protocols**: TCP (primary), WebRTC (fallback)
- **Circuit Relay**: For NAT traversal and connectivity in restricted networks
- **Bootstrap Peers**: Public bootstrap peers for initial network connection
- **Protocol Handlers**: Custom protocol handlers for direct messaging

### Security Considerations
- **Encrypted Communication**: All peer-to-peer communications are encrypted
- **Peer Authentication**: Verification of peer identities using libp2p mechanisms
- **Sandboxed Renderer**: Electron's contextIsolation for secure IPC

### Performance Optimizations
- **Efficient State Updates**: Using functional updates in React state
- **Connection Pooling**: Reuse existing connections where possible
- **Message Normalization**: Consistent message format handling

## Getting Started

To run the application:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start in development mode: `npm run dev`

To build for production:
```
npm run build
npm run package
```

## Future Enhancements
- File sharing capabilities
- End-to-end encryption for messages
- Persistent storage for message history
- Multiple identities/profiles
- Group chat with member management
- Offline message queuing 
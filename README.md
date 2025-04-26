# Libp2p Electron Application

A desktop application for peer-to-peer communication using libp2p, built with Electron, React, TypeScript, and TailwindCSS.

## Features

- libp2p node running on Node.js backend
- TCP as the main transport protocol with WebRTC circuit-relay-v2 as backup
- Direct messaging between peers
- Publish/subscribe to topics
- View connected peers and node information
- Modular and informative UI

## Development Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lmao_2

# Install dependencies
npm install
```

### Development

To run the app in development mode:

```bash
# Start the development server
npm run dev
```

This will start both the Electron main process and the Vite dev server for the renderer process.

### Building

To build the application:

```bash
# Build for production
npm run build

# Package the app
npm run dist
```

The packaged application will be available in the `release` directory.

## Project Structure

```
src/
├── main/             # Electron main process code
│   ├── main.ts       # Main entry point for Electron
│   ├── preload.ts    # Preload script for exposing APIs to renderer
│   └── interfaces.ts # TypeScript interfaces for main process
├── renderer/         # React application code
│   ├── components/   # React components
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── index.tsx     # Entry point for React app
│   └── routes.tsx    # TanStack Router configuration
└── lib/              # Shared utilities and libp2p implementation
```

## Libp2p Configuration

The libp2p node is configured with:

- TCP, WebSockets, and WebRTC transport protocols
- Noise encryption
- YAMUX stream multiplexer
- Bootstrap and PubSub peer discovery
- Circuit relay for NAT traversal
- Direct messaging and PubSub for communication

## License

ISC 
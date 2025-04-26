import { createContext, useContext } from 'react';
export const defaultLibp2pContext = {
    isConnected: false,
    isInitializing: true,
    error: null,
    peerId: null,
    multiaddrs: [],
    peers: [],
    messages: [],
    connectToPeer: async () => { throw new Error('Not implemented'); },
    sendDirectMessage: async () => { throw new Error('Not implemented'); },
    publishToTopic: async () => { throw new Error('Not implemented'); },
    subscribeToTopic: async () => { throw new Error('Not implemented'); },
    unsubscribeFromTopic: async () => { throw new Error('Not implemented'); },
    clearMessages: () => { throw new Error('Not implemented'); },
};
export const Libp2pContext = createContext(defaultLibp2pContext);
export function useLibp2p() {
    const context = useContext(Libp2pContext);
    if (context === undefined) {
        throw new Error('useLibp2p must be used within a Libp2pProvider');
    }
    return context;
}

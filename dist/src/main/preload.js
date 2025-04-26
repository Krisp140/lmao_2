"use strict";
const { contextBridge, ipcRenderer } = require('electron');
console.log('[preload] Script loaded');
// Expose IPC APIs to the renderer process
contextBridge.exposeInMainWorld('libp2pAPI', {
    /**
     * @param {string} multiaddr
     */
    connectToPeer: (multiaddr) => {
        console.log('[preload] connectToPeer called with:', multiaddr);
        return ipcRenderer.invoke('connect-to-peer', multiaddr);
    },
    /**
     * @param {string} peerId
     * @param {string} message
     */
    sendDirectMessage: (peerId, message) => {
        console.log('[preload] sendDirectMessage called with:', peerId, message);
        return ipcRenderer.invoke('send-direct-message', { peerId, message });
    },
    // Get connected peers
    getConnectedPeers: () => {
        console.log('[preload] getConnectedPeers called');
        return ipcRenderer.invoke('get-connected-peers');
    },
    /**
     * @param {string} topic
     * @param {string} message
     */
    publishToTopic: (topic, message) => {
        console.log('[preload] publishToTopic called with:', topic, message);
        return ipcRenderer.invoke('publish-to-topic', { topic, message });
    },
    /**
     * @param {string} topic
     */
    subscribeToTopic: (topic) => {
        console.log('[preload] subscribeToTopic called with:', topic);
        return ipcRenderer.invoke('subscribe-to-topic', { topic });
    },
    /**
     * @param {(data: any) => void} callback
     */
    onLibp2pReady: (callback) => {
        console.log('[preload] onLibp2pReady listener registered');
        const listener = (_, data) => {
            console.log('[preload] libp2p-ready event received:', data);
            callback(data);
        };
        ipcRenderer.on('libp2p-ready', listener);
        return () => {
            console.log('[preload] onLibp2pReady listener removed');
            ipcRenderer.removeListener('libp2p-ready', listener);
        };
    },
    /**
     * @param {(data: any) => void} callback
     */
    onPeerConnected: (callback) => {
        console.log('[preload] onPeerConnected listener registered');
        const listener = (_, data) => {
            console.log('[preload] peer-connected event received:', data);
            callback(data);
        };
        ipcRenderer.on('peer-connected', listener);
        return () => {
            console.log('[preload] onPeerConnected listener removed');
            ipcRenderer.removeListener('peer-connected', listener);
        };
    },
    /**
     * @param {(data: any) => void} callback
     */
    onPeerDisconnected: (callback) => {
        console.log('[preload] onPeerDisconnected listener registered');
        const listener = (_, data) => {
            console.log('[preload] peer-disconnected event received:', data);
            callback(data);
        };
        ipcRenderer.on('peer-disconnected', listener);
        return () => {
            console.log('[preload] onPeerDisconnected listener removed');
            ipcRenderer.removeListener('peer-disconnected', listener);
        };
    },
    /**
     * @param {(data: any) => void} callback
     */
    onDirectMessage: (callback) => {
        console.log('[preload] onDirectMessage listener registered');
        const listener = (_, data) => {
            console.log('[preload] direct-message event received:', data);
            callback(data);
        };
        ipcRenderer.on('direct-message', listener);
        return () => {
            console.log('[preload] onDirectMessage listener removed');
            ipcRenderer.removeListener('direct-message', listener);
        };
    },
    /**
     * @param {(data: any) => void} callback
     */
    onTopicMessage: (callback) => {
        console.log('[preload] onTopicMessage listener registered');
        const listener = (_, data) => {
            console.log('[preload] topic-message event received:', data);
            callback(data);
        };
        ipcRenderer.on('topic-message', listener);
        return () => {
            console.log('[preload] onTopicMessage listener removed');
            ipcRenderer.removeListener('topic-message', listener);
        };
    }
});

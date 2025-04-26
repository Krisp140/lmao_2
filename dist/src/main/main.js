import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { startLibp2p } from '../lib/libp2p.js';
import { multiaddr } from '@multiformats/multiaddr';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { peerIdFromString } from '@libp2p/peer-id';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let mainWindow = null;
let libp2p = null;
async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (process.env.NODE_ENV === 'development') {
        // Load from development server
        await mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        // Load from built files
        await mainWindow.loadFile(path.join(__dirname, '..', '..', 'renderer', 'index.html'));
    }
}
async function initLibp2p() {
    try {
        libp2p = await startLibp2p();
        console.log('libp2p node started with peer id:', libp2p.peerId.toString());
        // Send peer info to renderer when libp2p is ready
        if (mainWindow) {
            mainWindow.webContents.send('libp2p-ready', {
                isConnected: true,
                isInitializing: false,
                error: null,
                peerId: libp2p.peerId.toString(),
                multiaddrs: libp2p.getMultiaddrs().map(ma => ma.toString()),
                peers: [] // Optionally, fill with connected peers if you track them
            });
        }
        // Set up event listeners for libp2p events
        libp2p.addEventListener('peer:connect', (evt) => {
            // evt.detail can be a PeerId or { remotePeer, remoteAddr }
            let remotePeer, remoteAddr;
            if (evt.detail && typeof evt.detail.toString === 'function' && !evt.detail.remotePeer) {
                // evt.detail is a PeerId
                remotePeer = evt.detail;
                remoteAddr = undefined;
            }
            else if (evt.detail && evt.detail.remotePeer) {
                // evt.detail is { remotePeer, remoteAddr }
                remotePeer = evt.detail.remotePeer;
                remoteAddr = evt.detail.remoteAddr;
            }
            if (!remotePeer) {
                console.error('peer:connect event missing remotePeer:', evt.detail);
                return;
            }
            const peerInfo = {
                id: remotePeer.toString(),
                multiaddrs: remoteAddr ? [remoteAddr.toString()] : []
            };
            if (mainWindow) {
                console.log('peer-connected event received:', peerInfo);
                mainWindow.webContents.send('peer-connected', { peerInfo });
            }
        });
        libp2p.addEventListener('peer:disconnect', (evt) => {
            let remotePeer, remoteAddr;
            if (evt.detail && typeof evt.detail.toString === 'function' && !evt.detail.remotePeer) {
                // evt.detail is a PeerId
                remotePeer = evt.detail;
                remoteAddr = undefined;
            }
            else if (evt.detail && evt.detail.remotePeer) {
                // evt.detail is { remotePeer, remoteAddr }
                remotePeer = evt.detail.remotePeer;
                remoteAddr = evt.detail.remoteAddr;
            }
            if (!remotePeer) {
                console.error('peer:disconnect event missing remotePeer:', evt.detail);
                return;
            }
            if (mainWindow) {
                mainWindow.webContents.send('peer-disconnected', {
                    id: remotePeer.toString(),
                    multiaddrs: remoteAddr ? [remoteAddr.toString()] : []
                });
            }
        });
        // Handle direct messages
        libp2p.services.directMessage.addEventListener('message', (evt) => {
            //console.debug('Main process received direct message:', evt.detail)
            if (mainWindow) {
                mainWindow.webContents.send('direct-message', {
                    from: evt.detail.connection.remotePeer.toString(),
                    data: evt.detail.content,
                    type: evt.detail.type
                });
            }
        });
    }
    catch (err) {
        console.error('Failed to start libp2p node:', err);
    }
}
// Set up IPC handlers
function setupIPC() {
    // Connect to peer
    ipcMain.handle('connect-to-peer', async (_, multiaddrStr) => {
        try {
            if (!libp2p)
                throw new Error('libp2p not initialized');
            const ma = multiaddr(multiaddrStr);
            const connection = await libp2p.dial(ma);
            return {
                success: true,
                peerId: connection.remotePeer.toString(),
                multiaddr: connection.remoteAddr.toString()
            };
        }
        catch (err) {
            console.error('Failed to connect to peer:', err);
            return { success: false, error: err.message };
        }
    });
    // Send direct message
    ipcMain.handle('send-direct-message', async (_, { peerId, message }) => {
        try {
            if (!libp2p)
                throw new Error('libp2p not initialized');
            // Convert peerId string to PeerId object if necessary
            console.log('Sending direct message to peer:', peerId);
            const peerIdObj = typeof peerId === 'string' ? peerIdFromString(peerId) : peerId;
            const result = await libp2p.services.directMessage.send(peerIdObj, message);
            return { success: true, result };
        }
        catch (err) {
            console.error('Failed to send direct message:', err);
            return { success: false, error: err.message };
        }
    });
    // Get connected peers
    ipcMain.handle('get-connected-peers', async () => {
        try {
            if (!libp2p)
                throw new Error('libp2p not initialized');
            const peers = libp2p.getPeers();
            const peerDetails = peers.map(peerId => {
                const connections = libp2p?.getConnections(peerId) || [];
                return {
                    id: peerId.toString(),
                    connections: connections.map(conn => ({
                        addr: conn.remoteAddr.toString(),
                        // Just return an empty array for protocols for now
                        protocols: []
                    }))
                };
            });
            return { success: true, peers: peerDetails };
        }
        catch (err) {
            console.error('Failed to get connected peers:', err);
            return { success: false, error: err.message };
        }
    });
    // Publish to topic
    ipcMain.handle('publish-to-topic', async (_, { topic, message }) => {
        try {
            if (!libp2p)
                throw new Error('libp2p not initialized');
            await libp2p.services.pubsub.publish(topic, new TextEncoder().encode(message));
            return { success: true };
        }
        catch (err) {
            console.error('Failed to publish to topic:', err);
            return { success: false, error: err.message };
        }
    });
    // Subscribe to topic
    ipcMain.handle('subscribe-to-topic', async (_, { topic }) => {
        try {
            if (!libp2p)
                throw new Error('libp2p not initialized');
            // Set up message handler if not already subscribed
            if (!libp2p.services.pubsub.getSubscribers(topic).includes(libp2p.peerId)) {
                libp2p.services.pubsub.addEventListener('message', (evt) => {
                    if (evt.detail.topic === topic && mainWindow) {
                        mainWindow.webContents.send('topic-message', {
                            topic: evt.detail.topic,
                            from: evt.detail.from.toString(),
                            data: new TextDecoder().decode(evt.detail.data)
                        });
                    }
                });
            }
            libp2p.services.pubsub.subscribe(topic);
            return { success: true };
        }
        catch (err) {
            console.error('Failed to subscribe to topic:', err);
            return { success: false, error: err.message };
        }
    });
}
app.whenReady().then(async () => {
    await createWindow();
    setupIPC();
    await initLibp2p();
    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
});
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        if (libp2p) {
            await libp2p.stop();
            libp2p = null;
        }
        app.quit();
    }
});
app.on('before-quit', async (event) => {
    if (libp2p) {
        event.preventDefault();
        await libp2p.stop();
        libp2p = null;
        app.quit();
    }
});

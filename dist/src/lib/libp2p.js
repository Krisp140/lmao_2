// Import required modules
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { sha256 } from 'multiformats/hashes/sha2';
import { createLibp2p } from 'libp2p';
import { identify } from '@libp2p/identify';
import { peerIdFromString } from '@libp2p/peer-id';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { webSockets } from '@libp2p/websockets';
import { tcp } from '@libp2p/tcp';
import { webRTC } from '@libp2p/webrtc';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { ping } from '@libp2p/ping';
import { BOOTSTRAP_PEER_IDS, CHAT_FILE_TOPIC, CHAT_TOPIC } from './constants.js';
import first from 'it-first';
import { forComponent, enable } from './logger.js';
import { directMessage } from './direct-message.js';
import { createDelegatedRoutingV1HttpApiClient, } from '@helia/delegated-routing-v1-http-api-client';
const log = forComponent('libp2p');
export async function startLibp2p() {
    // enable verbose logging in browser console to view debug logs
    enable('ui*,libp2p*,-libp2p:connection-manager*,-*:trace');
    const delegatedClient = createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev');
    const relayListenAddrs = await getRelayListenAddrs(delegatedClient);
    log('starting libp2p with relayListenAddrs: %o', relayListenAddrs);
    let libp2p;
    libp2p = await createLibp2p({
        addresses: {
            listen: [
                // Listen on TCP
                '/ip4/0.0.0.0/tcp/0',
                // Listen for webRTC connection
                '/webrtc',
                ...relayListenAddrs,
            ],
        },
        transports: [
            tcp(),
            webSockets(),
            webRTC(),
            // Required to create circuit relay reservations
            circuitRelayTransport(),
        ],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
        connectionGater: {
            denyDialMultiaddr: async () => false,
        },
        //peerDiscovery: [
        //pubsubPeerDiscovery({
        //  interval: 10_000,
        //  topics: [PUBSUB_PEER_DISCOVERY],
        //  listenOnly: false,
        //}),
        //],
        services: {
            pubsub: gossipsub({
                allowPublishToZeroTopicPeers: true,
                msgIdFn: msgIdFnStrictNoSign,
                ignoreDuplicatePublishError: true,
            }),
            // Delegated routing helps us discover the ephemeral multiaddrs of the bootstrap peers
            delegatedRouting: () => delegatedClient,
            identify: identify(),
            // Custom protocol for direct messaging
            directMessage: directMessage(),
            ping: ping(),
        },
    });
    if (!libp2p) {
        throw new Error('Failed to create libp2p node');
    }
    libp2p.services.pubsub.subscribe(CHAT_TOPIC);
    libp2p.services.pubsub.subscribe(CHAT_FILE_TOPIC);
    libp2p.addEventListener('self:peer:update', ({ detail: { peer } }) => {
        const multiaddrs = peer.addresses.map(({ multiaddr }) => multiaddr);
        log(`changed multiaddrs: peer ${peer.id.toString()} multiaddrs: ${multiaddrs}`);
    });
    // Explicitly dial peers discovered via pubsub
    libp2p.addEventListener('peer:discovery', (event) => {
        const { multiaddrs, id } = event.detail;
        if (libp2p.getConnections(id)?.length > 0) {
            log(`Already connected to peer %s. Will not try dialling`, id);
            return;
        }
        dialWebRTCMaddrs(libp2p, multiaddrs);
    });
    return libp2p;
}
// Message IDs are used to dedupe inbound messages
// Every agent in network should use the same message id function
export async function msgIdFnStrictNoSign(msg) {
    var enc = new TextEncoder();
    const signedMessage = msg;
    const encodedSeqNum = enc.encode(signedMessage.sequenceNumber.toString());
    // Convert the digest to Uint8Array
    const digest = await sha256.digest(encodedSeqNum);
    return digest.bytes;
}
// Function which dials one maddr at a time to avoid establishing multiple connections to the same peer
async function dialWebRTCMaddrs(libp2p, multiaddrs) {
    // Filter webrtc (browser-to-browser) multiaddrs
    const webRTCMadrs = multiaddrs.filter((maddr) => maddr.protoNames().includes('webrtc'));
    log(`dialling WebRTC multiaddrs: %o`, webRTCMadrs);
    for (const addr of webRTCMadrs) {
        try {
            log(`attempting to dial webrtc multiaddr: %o`, addr);
            await libp2p.dial(addr);
            return; // if we succeed dialing the peer, no need to try another address
        }
        catch (error) {
            console.error(`failed to dial webrtc multiaddr: ${addr}`, error);
        }
    }
}
export const connectToMultiaddr = (libp2p) => async (multiaddr) => {
    log(`dialling: %s`, multiaddr.toString());
    try {
        const conn = await libp2p.dial(multiaddr);
        log('connected to %s on %s', conn.remotePeer.toString(), conn.remoteAddr.toString());
        return conn;
    }
    catch (e) {
        console.error(e);
        throw e;
    }
};
// Function which resolves PeerIDs of bootstrap nodes to multiaddrs dialable from client
// Returns both the dialable multiaddrs in addition to the relay
async function getRelayListenAddrs(client) {
    const peers = await Promise.all(BOOTSTRAP_PEER_IDS.map((peerId) => first(client.getPeers(peerIdFromString(peerId)))));
    const relayListenAddrs = [];
    for (const p of peers) {
        if (p && 'Addrs' in p && Array.isArray(p.Addrs) && p.Addrs.length > 0) {
            for (const maddr of p.Addrs) {
                const protos = maddr.protoNames();
                // Note: narrowing to Secure WebSockets and IP4 addresses to avoid potential issues with ipv6
                if (protos.includes('tls') && protos.includes('ws')) {
                    if (maddr.nodeAddress().address === '127.0.0.1')
                        continue; // skip loopback
                    if ('ID' in p) {
                        relayListenAddrs.push(getRelayListenAddr(maddr, p.ID));
                    }
                }
            }
        }
    }
    return relayListenAddrs;
}
// Constructs a multiaddr string representing the circuit relay v2 listen address for a relayed connection
const getRelayListenAddr = (maddr, peer) => `${maddr.toString()}/p2p/${peer.toString()}/p2p-circuit`;
export const getFormattedConnections = (connections) => connections.map((conn) => ({
    peerId: conn.remotePeer,
    protocols: [...new Set(conn.remoteAddr.protoNames())],
}));

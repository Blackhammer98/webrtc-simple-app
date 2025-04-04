import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from './useSocket';
import React from 'react';

interface Props {
  roomId: string;
}

export const useWebRTC = ({ roomId }: Props) => {
  const { socket, isConnected } = useSocket();
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement | null>>>({});
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun.stunprotocol.org', 'stun:stun.l.google.com:19302'],
      },
    ],
  };

  const startWebRTC = useCallback(async () => {
    if (!socket || !isConnected) return;

    socket.on('user-joined', async ({ userId }) => {
      console.log(`User ${userId} joined room ${roomId}`);
      await createOffer(userId);
    });

    socket.on('offer', async ({ offer, senderId }) => {
      console.log(`Received offer from ${senderId}`);
      await createAnswer(senderId, offer);
    });

    socket.on('answer', ({ answer, senderId }) => {
      console.log(`Received answer from ${senderId}`);
      setRemoteDescription(senderId, answer);
    });

    socket.on('ice-candidate', ({ candidate, senderId }) => {
      if (candidate) {
        addIceCandidate(senderId, candidate);
      }
    });

    socket.on('user-left', ({ userId }) => {
      console.log(`User ${userId} left room ${roomId}`);
      removePeerConnection(userId);
    });

    // Notify backend that user has joined the room
    socket.emit('join-room', roomId);

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
      // Clean up peer connections?
    };
  }, [socket, isConnected, roomId]);

  useEffect(() => {
    startWebRTC();
  }, [startWebRTC]);

  

  const createPeerConnection = useCallback((remoteUserId: string) => {
    const pc = new RTCPeerConnection(servers);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', {
          candidate: event.candidate,
          receiverId: remoteUserId,
          roomId,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('Remote track received:', event.streams[0]);
      // Handle adding the remote stream to the UI
      setRemoteStreams(prevStreams => {
        const existingStream = prevStreams.find(stream => stream.id === event.streams[0]?.id);
        if (existingStream) {
          return prevStreams; // Stream already exists
        }
        return [...prevStreams, event.streams[0]];
      });
    };

    const localStream = localVideoRef.current?.srcObject as MediaStream | undefined;
    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    peerConnections.current[remoteUserId] = pc;
    remoteVideoRefs.current[remoteUserId] = React.createRef<HTMLVideoElement>();
    return pc;
  }, [socket, roomId]);

  const createOffer = useCallback(async (remoteUserId: string) => {
    const pc = createPeerConnection(remoteUserId);
    if (pc) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.emit('offer', { offer, receiverId: remoteUserId, roomId });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }
  }, [createPeerConnection, socket, roomId]);

  const createAnswer = useCallback(async (remoteUserId: string, offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection(remoteUserId);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket?.emit('answer', { answer, receiverId: remoteUserId, roomId });
      } catch (error) {
        console.error('Error creating answer:', error);
      }
    }
  }, [createPeerConnection, socket, roomId]);

  const setRemoteDescription = useCallback(async (remoteUserId: string, answer: RTCSessionDescriptionInit) => {
    if (peerConnections.current[remoteUserId]) {
      try {
        await peerConnections.current[remoteUserId].setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error setting remote description:', error);
      }
    }
  }, []);

  const addIceCandidate = useCallback(async (remoteUserId: string, candidate: RTCIceCandidateInit) => {
    if (peerConnections.current[remoteUserId]) {
      try {
        await peerConnections.current[remoteUserId].addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }, []);

  const removePeerConnection = useCallback((remoteUserId: string) => {
    if (peerConnections.current[remoteUserId]) {
      peerConnections.current[remoteUserId].close();
      delete peerConnections.current[remoteUserId];
      delete remoteVideoRefs.current[remoteUserId];
      setRemoteStreams(prevStreams => prevStreams.filter(stream => stream.id !== remoteUserId)); // Basic filter, might need adjustment
    }
  }, []);

  return {
    localVideoRef,
    remoteVideoRefs,
    remoteStreams,
  };
};
import React, { useRef, useEffect, } from 'react';
import { useParams } from 'react-router-dom';
import { useUserMedia } from '../hooks/useUserMedia';
import {LocalVideo} from '../components/Display/LocalVideo';
import { useWebRTC } from '../hooks/useWebRTC';
import {AudioToggle} from '../components/Controls/MediaToggle';
import {VideoToggle} from '../components/Controls/MediaToggle';


const RoomPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement>>>({});

  const { roomId } = useParams<{ roomId: string }>();
  const { localVideoStream, mediaError, isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo } = useUserMedia();
  const { remoteStreams} = useWebRTC({ roomId : roomId! });

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localVideoStream;
    }
  }, [localVideoStream, localVideoRef]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Room: {roomId}</h1>

      {mediaError && <p className="text-red-500 mb-2">{mediaError}</p>}

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Your Video</h2>
        <LocalVideo stream={localVideoStream} />
      </div>

      <div className="flex space-x-4 mb-4">
        <AudioToggle isEnabled={isAudioEnabled} onToggle={toggleAudio} />
        <VideoToggle isEnabled={isVideoEnabled} onToggle={toggleVideo} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {remoteStreams.map((stream, index) => (
          <div key={stream.id}>
            <h3 className="text-md font-semibold mb-1 text-gray-700">Remote Video {index + 1}</h3>
            <video
              ref={remoteVideoRefs.current[stream.id]}
              autoPlay
              className="w-64 h-48 object-cover rounded-md shadow-md"
              srcObject={stream}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
import { useParams } from "react-router-dom"
import { useUserMedia } from "../hooks/useUserMedia";
import { LocalVideo } from "../components/Display/LocalVideo";
import { AudioToggle, VideoToggle } from "../components/Controls/MediaToggle";


export function RoomPage() {
const {roomId} = useParams<{roomId : string}>();
console.log('RoomPage rendered with roomId:', roomId);
const {
    localAudioStream,
    localVideoStream,
    isAudioEnabled,
    isVideoEnabled,
    mediaError,
    toggleAudio,
    toggleVideo,
} = useUserMedia()

console.log('Local Video Stream in RoomPage:', localVideoStream);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200 p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800"> Welcome to Room: {roomId}</h1>    
       {mediaError && <p className="text-red-500 mb-2">{mediaError}</p>}

       {localVideoStream && (
         <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 ">Your Video</h2>
            <LocalVideo stream={localVideoStream}/>
            </div>
       )}
        <div className="flex space-x-4 mb-4">
          <AudioToggle isEnabled = {isAudioEnabled} onToggle={toggleAudio}/>
          <VideoToggle isEnabled = {isVideoEnabled} onToggle={toggleVideo}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Remote videos will go here */}
      </div>

    </div>
    ) 
}
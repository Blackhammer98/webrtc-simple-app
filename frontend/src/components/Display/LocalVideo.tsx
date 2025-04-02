import { useEffect, useRef } from "react";


interface LocalVideoProps {
    stream?: MediaStream | null;
  }
  

export const LocalVideo: React.FC<LocalVideoProps> = ({ stream }) => {

    const localVideoRef = useRef<HTMLVideoElement>(null);
    
    useEffect(() => {
        const videoElement = localVideoRef.current;
        const streamToUse = stream ;
        if (videoElement && streamToUse) {
            videoElement.srcObject = streamToUse;
          } else if (videoElement) {
            videoElement.srcObject = null;
          }
    },[stream]);
    
    return (
       <video
       ref={localVideoRef}
       autoPlay
       muted
       className="w-64 h-48 object-cover rounded-md shadow-md"
       />
    );
};
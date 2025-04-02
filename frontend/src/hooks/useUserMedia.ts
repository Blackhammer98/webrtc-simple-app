

import { useCallback, useEffect, useState } from "react";




export const useUserMedia = () => {
  const [localVideoStream , setLocalVideoStream] = useState<MediaStream | null>(null);
  const [localAudioStream , setlocalAudioStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled  , setIsVideoEnabled] = useState(true);
  const [isAudioEnabled , setIsAudioEnabled] = useState(true);
  const [mediaError , setMediaError] = useState<string | null>(null);

    const getLocalMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio : true,
                video : true,
               });
        
               const videoTrack = stream.getVideoTracks()[0];
               const audioTrack = stream.getAudioTracks()[0];
        
               setLocalVideoStream(stream);
               setlocalAudioStream(new MediaStream([audioTrack]));
               setIsVideoEnabled(videoTrack ? videoTrack.enabled : false);
               setIsAudioEnabled(audioTrack ? audioTrack.enabled : false);
               setMediaError(null);
        } catch (error:any) {
            console.error('Error accessing media Device :', error );
            setMediaError('Failed to access camera and microphone.')
        }
       
    },[setlocalAudioStream,setLocalVideoStream,setIsAudioEnabled, setIsVideoEnabled]);

    const enableVideo = useCallback(() => {

        if(localVideoStream) {
            localVideoStream.getVideoTracks().forEach(track => (track.enabled =  true));
            setIsVideoEnabled(true);
        }
    },[localVideoStream , setIsVideoEnabled]);

    const disableVideo = useCallback( () => {

        if(localVideoStream) {
           localVideoStream.getVideoTracks().forEach(track => (track.enabled = false));
           setIsVideoEnabled(false)
        }
    },[localVideoStream ,setIsVideoEnabled]);

    const toggleVideo = useCallback(() => {
       if(isVideoEnabled) {
        disableVideo();
       }else {
        enableVideo();
       }
    },[isVideoEnabled ,enableVideo , disableVideo]);

    const enableAudio = useCallback(() => {
        if(localAudioStream) {
            localAudioStream.getAudioTracks().forEach(track => (track.enabled = true));
            setIsAudioEnabled(true);
        }
    },[localAudioStream , setIsAudioEnabled]);

    const disableAudio = useCallback(() => {
      if(localAudioStream) {
        localAudioStream.getAudioTracks().forEach(track => (track.enabled = false));
        setIsAudioEnabled(false);
      }
    },[localAudioStream,setIsAudioEnabled]);

    const toggleAudio = useCallback(()=>{
       if(isAudioEnabled) {
        disableAudio();
       }else {
        enableAudio();
       }
    },[isAudioEnabled,disableAudio,enableAudio]);


    useEffect(() => {
       getLocalMedia();
},[getLocalMedia]);

return {
    localAudioStream,
    localVideoStream,
    isAudioEnabled,
    isVideoEnabled,
    mediaError,
    enableAudio,
    disableAudio,
    toggleAudio,
    enableVideo,
    disableVideo,
    toggleVideo,
   };
};
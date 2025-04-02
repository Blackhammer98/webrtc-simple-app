import React from "react";
interface  AudioToggleProps {
    isEnabled : boolean ;
    onToggle : () => void;
}
export const AudioToggle : React.FC<AudioToggleProps> = ({isEnabled , onToggle }) => {
    return (
        
            <button
            onClick={onToggle}
            className={`px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isEnabled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
      }`}
          >
              {isEnabled ? 'Mute Audio' : 'Unmute Audio'}
            </button>
    )   
};

interface  VideoToggleProps {
    isEnabled : boolean ;
    onToggle : () => void;
}

export const VideoToggle : React.FC<VideoToggleProps> = ({isEnabled , onToggle}) => {
    return (
        
            <button 
            onClick={onToggle}
            className={`px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isEnabled ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white'
      }`}
            
            >
               {isEnabled ? 'Disable Video' : 'Enable Video'}
            </button>
        
    )
}
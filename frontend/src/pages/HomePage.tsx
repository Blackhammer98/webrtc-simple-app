import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"

import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { currentRoomIdState } from "../store/atoms/roomAtom";





export function HomePage() {
    const [roomIdInput , setRoomIdInput] = useState("");
    const [generatedRoomId , setGeneratedRoomId] = useState<string | null>(null);
    const setCurrentRoomId = useSetRecoilState(currentRoomIdState);
    const navigate = useNavigate();
    const {socket , isConnected ,joinRoom , requestNewRoomId ,createRoom ,socketError} = useSocket();

    useEffect(() => {
     if(socket) {
        socket.on('newRoomId',(roomId : string) => {
            console.log('New room Id is received :' , roomId)
            setGeneratedRoomId(roomId);
            navigate(`/room/${roomId}`);
        });

        socket.on('joinedRoom',(roomId : string) => {
            console.log('Joined Room:' , roomId);
            setCurrentRoomId(roomId);
        });

        socket.on('room created' , (roomId : string) => {
           console.log('Room Created :', roomId);
           setCurrentRoomId(roomId);
           navigate(`/room/${roomId}`)
        });

        return () => {
            socket.off('newRoomId');
            socket.off('joinedRoom');
            socket.off('room created');
            socket.off('');
            socket.off('');
            socket.off('');
        }
     }
    },[socket , navigate , setCurrentRoomId]);

    const handleJoinExistingRoom = () => {
      if(roomIdInput) {
        joinRoom(roomIdInput);
      }else {
        alert('Please enter the Room ID to join.')
      }
    };

    const handleCreateNewRoom = () => {
        requestNewRoomId();
    };

    const handleCreateWithId = () => {
        if(generatedRoomId) {
            createRoom(generatedRoomId);
        }
    };

    return ( 
    <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Video Conference App</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Join an Existing Room</h2>
        <div className="mb-4">
             <label className="block text-gray-700 text-sm font-bold mb-2"> 
                Room ID :
             </label>
             <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 eading-tight focus:outline-none focus:shadow-outline"  
                id="room-id"
                type="text"
                placeholder="Enter Room ID"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
             />
        </div>
        <div className="flex items-center justify-center mb-4">
            <button
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
               type="button"
               onClick={handleJoinExistingRoom}
               disabled= {!isConnected}
            >
                Join Room
            </button>
        </div>
        
        <hr className="my-6 border-t-2 border-gray-400 border-dashed" />

        <h2 className="text-lg font-semibold mb-4 text-gray-800">Create a  New Room</h2>
        <div className="mb-4">
            <button 
            className="bg-green-500 hover:bg-green-700 text-white rounded font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleCreateNewRoom}
            disabled={!isConnected}
            >
                Request New Room ID
            </button>
            {generatedRoomId && (
            <div className="mt-2">
              <p className="text-gray-700 text-sm">Generated Room ID: <span className="font-semibold">{generatedRoomId}</span></p>
              <button
                className="mt-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleCreateWithId}
                disabled={!isConnected}
              >
                Create Room with this ID
              </button>
            </div>
          )}
            
        </div>
        {socketError && <p className="text-red-500 text-xs italic mt-4">{socketError}</p>}
        {!isConnected && <p className="text-yellow-500 text-xs italic mt-2">Connecting to server...</p>}
     
      </div>
    </div>
    );
}
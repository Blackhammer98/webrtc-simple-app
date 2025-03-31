import { useParams } from "react-router-dom"


export function RoomPage() {
const {roomId} = useParams<{roomId : string}>();

    return <div>
        Welcome to Room: {roomId}
    </div>
}
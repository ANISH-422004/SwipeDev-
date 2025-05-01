import io from "socket.io-client"
import { VITE_BASE_URL } from "./constants"


export const  createSocketConnection = () => {
    if(location.hostname === "localhost"){
        return io(VITE_BASE_URL)
    }else{
        return io("/" , "/dev/socket.io")
    }
}
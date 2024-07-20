"use client"

import { useSocket } from "./providers/Socket-provider"
import { Badge } from "./ui/badge";

export const SocKetIndicator = () =>{
    const {isConnected,socket} = useSocket();
    console.log(isConnected,socket);
    if(!isConnected){
        return(
            <Badge variant={"outline"} className=" bg-yellow-600 text-white border-none">
                Fallback: Polling every 1s
            </Badge>
        )
    }
    return(
        <Badge variant={"outline"} className=" bg-emerald-600 text-white border-none">
            Live: Real-time updates
        </Badge>
    )
}
import { NextApiResponseIO } from "@/type";
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import {Server as ServerIO} from "socket.io";


export const config = {
    api:{
        bodyParser:false,
    }
}

const ioHandler = (req:NextApiRequest,res:NextApiResponseIO)=>{
    if(!res.socket.server.io){
        const path = "/api/sockets/io";
        const httpServer:NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer,{
            path: path,
            
        })
        res.socket.server.io = io;
        
    }
    res.end();
}

export default ioHandler; 
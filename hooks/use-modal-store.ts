import { Channel, ChannelType, Server } from "@prisma/client";
import {create} from "zustand"

export type ModalType = "createServer"| "invite" |"editServer"|"members"|"createChannel"|"leaveServer"|"deleteServer"|"deleteChannel"|"deleteMessage"|"editChannel"|"messageFile"| null;
interface ModalData{
    server?:Server;
    channelType?:ChannelType;
    channel?:Channel;
    apiUrl?:string;
    query?:Record<string,any>;
}
interface ModalStore{
    type: ModalType;
    data:ModalData;
    isOpen: boolean;
    anOpen:(type:ModalType,data?:ModalData)=>void;
    anClose:()=>void;

    
}
export const useModal = create<ModalStore>((set)=>({
    type:null,
    isOpen:false,
    data:{},
    anOpen:(type,data={})=>{set({isOpen:true,type,data})},
    anClose:()=>{set({isOpen:false,type:null})},
    

}))
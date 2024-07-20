"use client"

import {CreateServerModal} from "@/components/modals/create-server-modal"
import { useEffect, useState } from "react";
import { InviteModal } from "../modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MemberModal } from "../modals/member-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { MessageFileModal } from "../modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";

export const ModalProvider = () =>{
    const [isMounted,serIsMounted] = useState(false);
    
    useEffect(()=>{
        serIsMounted(true);
        
    },[])

    if(!isMounted){
        return null;
    }
    return (
        <>
        <CreateServerModal/>
        <InviteModal/>
        <EditServerModal/>
        <MemberModal/>
        <CreateChannelModal/>
        <LeaveServerModal/>
        <DeleteServerModal/>
        <DeleteChannelModal/>
        <EditChannelModal/>
        <MessageFileModal/>
        <DeleteMessageModal/>
        </>
    )
}
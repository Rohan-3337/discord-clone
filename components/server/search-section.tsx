"use client"

import { ServerWithMembersWithProfiles } from "@/type";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltips";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";


interface ServerSectionProps {
    role?: string;
    label: string;
    sectionType:"channels" | "members";
    channelType:ChannelType;
    server?:ServerWithMembersWithProfiles
}
export const  SearchSection = ({role,label,sectionType,server,channelType}:ServerSectionProps) =>{
    const {anOpen} = useModal();
    
    return(
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role!==MemberRole.GUEST && sectionType==="channels" &&(
                <ActionTooltip label="Create Channel" side="top">
                    <button className=" text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300
                    transition"
                    onClick={()=>anOpen("createChannel",{channelType})}>
                        <Plus className="h-4 w-4"/>
                    </button>
                </ActionTooltip>
            )}
            {role===MemberRole.ADMIN && sectionType==="members" &&(
                <ActionTooltip label="Manage Members" side="top">
                <button className=" text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300
                transition"
                onClick={()=>anOpen("members",{server})}>
                    <Settings className="h-4 w-4"/>
                </button>
            </ActionTooltip>
            )}


        </div>
    )
}
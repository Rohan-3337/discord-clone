"use client"

import { ServerWithMembersWithProfiles } from "@/type";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";


interface ServerHeadersProps{
    server:ServerWithMembersWithProfiles;
    role?:MemberRole;

}
export const ServerHeader = ({server,role}:ServerHeadersProps)=>{
    const{anOpen} = useModal();
    const isAdmin = role===MemberRole.ADMIN;
    const isModerator = isAdmin||role===MemberRole.MODERATOR;

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/50 transition">
                {server.name}
                <ChevronDown className="h-5 w-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="
            w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {isModerator &&(
                    <DropdownMenuItem 
                    className="text-indigo-600 dark:text-indigo-400
                    px-3 py-4 text-sm cursor-pointer"
                    onClick={()=>anOpen("invite",{server})}>
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

{isAdmin &&(
                    <DropdownMenuItem 
                    className="px-3 py-4 text-sm cursor-pointer"
                    onClick={()=>anOpen("editServer",{server})}>
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
{isAdmin &&(
                    <DropdownMenuItem 
                    className="px-3 py-4 text-sm cursor-pointer"
                    onClick={()=>anOpen("members",{server})}>
                        Manage Members
                        <Users className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator &&(
                    <DropdownMenuItem 
                    className="px-3 py-4 text-sm cursor-pointer"
                    onClick={()=>anOpen("createChannel",{server})}>
                        Create Channels
                        <PlusCircle className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator &&(
                    <DropdownMenuSeparator/>
                )}
                {
                    isAdmin&&(
                        <DropdownMenuItem className="text-rose-500 px-3 py-4 text-sm cursor-pointer"
                        onClick={()=>anOpen("deleteServer",{server})}>
                            Delete Server
                            <Trash className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }
                {
                    !isAdmin&&(
                        <DropdownMenuItem className="text-rose-500 px-3 py-4 text-sm cursor-pointer"
                        onClick={()=>anOpen("leaveServer",{server})}>
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )
                }

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

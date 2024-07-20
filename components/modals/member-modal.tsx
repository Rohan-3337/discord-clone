"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import qs from "query-string"
import { useModal } from "@/hooks/use-modal-store"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, Gavel, Loader2, MoreVertical, RefreshCw, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "@/type"
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";





export const MemberModal = ()=>{
    const {isOpen,type,anClose,data,anOpen} = useModal();
    const [isLoadingId, setIsLoadingId] = useState("")
    const isModalOpen = isOpen && type==="members";
    const router = useRouter();
    
    const {server}=data as{server:ServerWithMembersWithProfiles};
    const roleIconMap = {
        "GUEST":null,
        "MODERATOR":<ShieldCheck className=" w-4 h-4 ml-2 text-indigo-500"/>,
        "ADMIN":<ShieldAlert className="w-4 h-4 text-rose-500"/>
    }
    const OnKick = async (memberId:string) => {
        try {
            setIsLoadingId(memberId);
            const url = qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server?.id,
                
                }
            })
            const res = await axios.delete(url);
            router.refresh();
            anOpen("members",{server:res.data});

        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingId("");
        }
}
    const OnRoleChange = async (memberId:string,role:MemberRole) => {
            try {
                setIsLoadingId(memberId);
                const url = qs.stringifyUrl({
                    url:`/api/members/${memberId}`,
                    query:{
                        serverId:server?.id,
                    
                    }
                })
                const res = await axios.patch(url,{role});
                router.refresh();
                anOpen("members",{server:res.data});

            } catch (error) {
                console.log(error);
            }finally{
                setIsLoadingId("");
            }
    }
    
    return(
        <Dialog open={isModalOpen} onOpenChange={anClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    Manage Members
                </DialogTitle>
                
                </DialogHeader>
               <DialogDescription className="text-center font-bold text-zinc-400">
                {server?.members?.length} Members
               </DialogDescription>
                    <ScrollArea className="mt-8 max-h-[420px] p-6">
                        {server?.members?.map((member)=>(
                            <div className="flex items-center gap-x-2 mb-6" key={member?.id}>
                                <UserAvatar src={member?.profile?.imageUrl}/> 
                                <div className="flex flex-col gap-y-1">
                                        <div className="text-xs font-semibold flex items-center gap-x-2">
                                            {member?.profile?.name}
                                            {roleIconMap[member?.role]}
                                        </div>
                                        <p className="text-xs text-zinc-500">
                                            {member?.profile?.email}
                                        </p>
                                    </div>
                                    {server?.profileId !== member?.profileId && isLoadingId!==member?.id &&(
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-4 w-4 text-zinc-400"/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="left">
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger className="flex items-center">
                                                            <ShieldQuestion className="w-4 h-4 mr-2"/>
                                                            <span>Role</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuPortal>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem 
                                                                onClick={()=>OnRoleChange(member?.id,"GUEST")}>
                                                                    <Shield className="h-4 w-4 mr-2"/>
                                                                    Guest
                                                                    {member?.role ==="GUEST" &&(
                                                                        <Check className="h-4 w-4 ml-auto"/>
                                                                    )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                onClick={()=>OnRoleChange(member?.id,"MODERATOR")}>
                                                                    <ShieldCheck className="h-4 w-4 mr-2"/>
                                                                    Moderator
                                                                    {member?.role ==="MODERATOR" &&(
                                                                        <Check className="h-4 w-4 ml-auto"/>
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuPortal>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem className="text-rose-500"
                                                    onClick={()=>OnKick(member?.id)}>
                                                        <Gavel className="h-4 w-4  mr-2"/>
                                                        Kick
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )} 

                                    {isLoadingId===member.id &&(
                                        <Loader2
                                        className=" animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                                    )}
                            </div>
                        ))

                        }
                    </ScrollArea>
            </DialogContent>

        </Dialog>
    )
}
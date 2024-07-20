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


import { useModal } from "@/hooks/use-modal-store"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";




export const InviteModal = ()=>{
    const {isOpen,type,anClose,data,anOpen} = useModal();
    const origin = useOrigin();
    const isModalOpen = isOpen && type==="invite";
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const onCopy = ()=>{
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    const {server}=data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`
    const OnNew = async()=>{
        try {
           setIsLoading(true);
           const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
           anOpen("invite",{server:response.data})
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }  
    
    return(
        <Dialog open={isModalOpen} onOpenChange={anClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    invite friends
                </DialogTitle>
                
                </DialogHeader>
               <div className="p-6">
                <Label
                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server invite Link</Label>
                <div className="flex items-center mt-2 gap-x-2">
                    <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    value={inviteUrl}/>
                    <Button onClick={onCopy} disabled={isLoading} size={"icon"}>
                        {
                            copied?
                            <Check className="w-4 h-4"/>:
                            <Copy className=" w-4 h-4"/>
                        }
                    </Button>
                </div>
                <Button onClick={OnNew} variant={"link"} size={"sm"} className="text-xs text-zinc-500 mt-4">
                    Generate new Invite link
                    <RefreshCw className="h-4 w-4 ml-2"/>
                </Button>
               </div>

            </DialogContent>

        </Dialog>
    )
}
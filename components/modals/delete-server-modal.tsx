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

import { Button } from "../ui/button";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";




export const DeleteServerModal = ()=>{
    const {isOpen,type,anClose,data} = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type==="deleteServer";
    const [isLoading, setIsLoading] = useState(false);
   
    const {server}=data;
    const OnLeave = async() =>{
        try {
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            anClose(); 
            router.refresh();
            router.push("/");
            window.location.reload();
        } catch (error) {
            console.log("ERROR FROM LEAVE MODAL ",error);
        }finally{
            setIsLoading(false);
        }
    }
    
    return(
        <Dialog open={isModalOpen} onOpenChange={anClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    Delete Server
                </DialogTitle>
                <DialogDescription className=" text-center text-zinc-500">
                    Are You Sure You want to do this ?<br/>
                     <span className="font-semibold text-indigo-500">{server?.name}</span> will be permanently deleted
                </DialogDescription>
                </DialogHeader>
               
               <DialogFooter className="bg-gray-100 px-6 py-4">
                <div className="flex items-center justify-between w-full">
                    <Button disabled={isLoading} variant={"ghost"} onClick={anClose}>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} variant={"primary"} onClick={OnLeave}>
                        Confirm
                    </Button>
                </div>
            </DialogFooter>
            </DialogContent>
            
        </Dialog>
    )
}
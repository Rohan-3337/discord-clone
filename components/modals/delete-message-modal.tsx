"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    
  } from "@/components/ui/dialog"

  import qs from "query-string"

import { useModal } from "@/hooks/use-modal-store"

import { Button } from "../ui/button";

import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
export const DeleteMessageModal = () =>{
    const {isOpen,type,anClose,data} = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type==="deleteMessage";
    const [isLoading, setIsLoading] = useState(false);
   
    const {apiUrl,query}=data;
    const OnLeave = async() =>{
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url:apiUrl as string,
                query:query,
            })
            await axios.delete(url);
            anClose(); 
            
        } catch (error) {
            console.log("ERROR FROM delete message MODAL ",error);
        }finally{
            setIsLoading(false);
            anClose();
        }
    }
    
    return(
        <Dialog open={isModalOpen} onOpenChange={anClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    Delete Message
                </DialogTitle>
                <DialogDescription className=" text-center text-zinc-500">
                    Are You Sure You want to do this ?<br/>
                   This Message will be permanently deleted
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
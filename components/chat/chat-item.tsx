"use client"

import { Member, MemberRole, Profile } from "@prisma/client";
import * as z from "zod"
import qs from "query-string"
import axios from "axios"
import { useForm} from "react-hook-form"
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltips";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

interface ChatItemsProps{
    id: string;
    content: string;
    member:Member &{
        profile:Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl:string;
    socketQuery:Record<string,string>;
}
const fromSchema = z.object({
    content:z.string().min(1),
})
export const ChatItem = ({id,content,member,timestamp,fileUrl,deleted,currentMember,isUpdated,socketQuery,socketUrl}:ChatItemsProps) =>{
    const roleIconMap = {
        "GUEST":null,
        "MODERATOR":<ShieldCheck className=" w-4 h-4 ml-2 text-indigo-500"/>,
        "ADMIN":<ShieldAlert className="w-4 h-4 text-rose-500"/>
    }

    const[isEditing,setIsEdting] = useState(false);
    const {anOpen} = useModal()
    const router = useRouter();
    const form = useForm<z.infer<typeof fromSchema>>({
        resolver:zodResolver(fromSchema),
        defaultValues:{
            content:content,
        }
    })
    useEffect(()=>{
        form.reset({
            content:content,
        })
    },[content]);

    const OnMemberClick = () =>{
        try {
            if(member.id=== currentMember.id){
                return;
            }
            router.push(`/servers/${member.serverId}/conversations/${member.id}`)
        } catch (error) {
            console.log("CHAT ITEM ERROR", error);
        }
    }
    useEffect(()=>{
        const handleKeyDown = (event:any) =>{
            if(event.key === "Escape" || event.keyCode ===27){
                console.log("hellllllll");
                setIsEdting(false);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    },[])
    const onSubmit = async(value:z.infer<typeof fromSchema>) =>{
        try {
            const url =qs.stringifyUrl({
                url:`${socketUrl}/${id}`,
                query:socketQuery,
            });
            await axios.patch(url, value);
            form.reset();
            setIsEdting(false);
            
        } catch (error) {
            console.log(error);
        }
    }
    const isLoading = form.formState.isSubmitting;
    const filetype = fileUrl?.split(".").pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isOwner || isModerator|| isAdmin);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = filetype ==="pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;


    return(
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="flex gap-2 group items-start w-full">
                <div className=" cursor-pointer hover:drop-shadow-md transition" onClick={OnMemberClick}>
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>
                <div className="flex flex-col w-full">
                     <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer" onClick={OnMemberClick}>
                                {member.profile.name}
                                
                            </p>
                            <ActionTooltip label={member.role}>
                                    <p>{roleIconMap[member.role]}</p>
                                </ActionTooltip>
                        </div>
                        <span className=" text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                        
                     </div>
                     {
                            isImage && (
                                <a
                                href={fileUrl}
                                target={"_blank"}
                                rel="noopener noreferrer"
                                className=" relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center
                                bg-secondary h-48 w-48"
                                >
                                    <Image
                                    src={content}
                                    className=" object-cover"
                                    objectFit="cover"
                                    layout="fill"
                                    alt={fileUrl}/>

                                </a>
                            )
                        }
                        {isPDF &&(
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                            <a href={content} target="_blank" rel="noopener noreferrer"
                            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">PDF File</a>
                            
                                
                    
                        </div>
                        )}
                        {!fileUrl && !isEditing && (
                            <p className={cn("text-sm text-zinc-600 dark:text-zinc-300",deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
                                {content}
                                {isUpdated && !deleted && (
                                    <span className=" text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                        (edited)
                                    </span>
                                )}
                            </p>
                        )}
                        {!fileUrl && isEditing && (
                            <Form {...form}>
                                <form
                                className="flex items-center w-full gap-x-2 pt-2"
                                 onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field})=>(
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                    disabled={isLoading}
                                                    className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                                                    focus-visible:ring-0
                                                    focus-visible:ring-offset-0 text-zinc-600
                                                    dark:text-zinc-200"
                                                    placeholder={"Edited Message"}
                                                    {...field}/>
                                                    
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <Button disabled={isLoading} size={"sm"} variant={"primary"}>
                                        Save
                                    </Button>
                                </form>
                                <span className=" text-[10px] mt-1 text-zinc-400">
                                    press Escape to cancel,enter to Save
                                </span>
                            </Form>
                        )}
                        {canDeleteMessage &&(
                            <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                                 {canEditMessage&&(
                                    <>
                                    <ActionTooltip label="Edit">
                                        <Edit className=" cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                        onClick={()=>setIsEdting(!isEditing)}/>
                                    </ActionTooltip>
                                    <ActionTooltip label="Delete">
                                         <Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                         onClick={()=>anOpen("deleteMessage",{
                                            apiUrl:`${socketUrl}/${id}`,
                                            query:socketQuery,

                                         })}/>
                                    </ActionTooltip>
                                    </>
                                 )}
                            </div>
                        )}

                </div>
            </div>
        </div>
    )
}
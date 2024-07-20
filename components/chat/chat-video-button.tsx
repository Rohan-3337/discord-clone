"use client"

import qs from "query-string"
import { ActionTooltip } from "../action-tooltips"
import { Video, VideoOff } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"



export const ChatVideoButton = () =>{
    const pathname =usePathname();
    const router = useRouter();
    const searchparam = useSearchParams();
    const isVideo= searchparam?.get("video")
    const Icon = isVideo ? VideoOff:Video ;
    const tooltiplabel = isVideo ?"End video call": "Start video call";
    const onClick = async()=>{
        try {
            const url = qs.stringifyUrl({
                url:pathname || "",
                query:{
                    video:isVideo?undefined:true,
                }
            },{skipNull:true});
            router.push(url); 
        } catch (error) {
           console.log(error); 
        }
    }
    
return(
        <ActionTooltip label={tooltiplabel}>
            <button onClick={onClick} className=" hover:opacity-75 transition mr-4">
                <Icon className=" h-6 w-6 text-zinc-500 dark:text-zinc-400"/>
            </button>
        </ActionTooltip>
    )
}
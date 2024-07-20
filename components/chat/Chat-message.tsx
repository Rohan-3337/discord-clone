"use client";

import { Member, Profile,Message } from "@prisma/client";
import { ChatWelcome } from "./Chat-welcome";
import { useChatQuery } from "@/hooks/use-ChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import { ChatItem } from "./chat-item";
import { format} from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";


type MessagewithMemberswithProfile = Message&{
    member: Member&{
        profile:Profile
    }

}
interface ChatMessageProps{
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey:"channelId" | "conversationId";
    paramValue:string;
    type:"channel" | "conversation";
}
export const ChatMessage = ({name,socketQuery,socketUrl,chatId,paramKey,paramValue,type,member,apiUrl}:ChatMessageProps) =>{
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;
    const ChatRef = useRef<ElementRef<"div">>(null);
    const BottomRef = useRef<ElementRef<"div">>(null);

    const DATE_FORMAT = `d MMM yyyy HH:mm`
    const {data,hasNextPage,fetchNextPage,isFetchingNextPage,status} = useChatQuery({queryKey,apiUrl,paramKey,paramValue});
    useChatSocket({queryKey,addKey,updateKey})
    useChatScroll({
        chatRef:ChatRef,
        bottomRef:BottomRef,
        loadMore:fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,

    })
    if(status ==="pending"){
        return(
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className=" h-7 w-7 animate-spin text-zinc-500 my-4"/>
                <p className=" text-xs text-zinc-500 dark:text-zinc-400">
                    Loading Messages...
                </p>
            </div>
        )
    }
    if(status ==="error"){
        return(
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className=" h-7 w-7 animate-spin text-zinc-500 my-4"/>
                <p className=" text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        )
    }

    return(
        <div ref={ChatRef} className=" flex-1 flex flex-col py-4 overflow-y-auto">
            { !hasNextPage &&<div className="flex-1"/>}
            {!hasNextPage && (
                
                <ChatWelcome type={type} name={name}/>
            )}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className=" h-6 w-6 text-zinc-500 animate-spin my-4"/>
                    ):(
                        <button
                        onClick={()=>fetchNextPage()} 
                        className=" text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition ">
                            Load Previous message
                        </button>
                    )}
                </div>
            )}
                <div className="flex flex-col-reverse mt-auto">
                    {data?.pages.map((group,i) =>(
                        <Fragment key={i}>
                            {Array.isArray(group?.items) && group?.items.map((message:MessagewithMemberswithProfile) =>(
                                 <div key={message?.id}>
                                    <ChatItem
                                    key={message?.id}
                                    id={message?.id}
                                    member={message?.member}
                                    currentMember={member}
                                    content={message?.content}
                                    fileUrl={message?.fileUrl}
                                    deleted={message?.deleted}
                                    timestamp={format(new Date(message?.createdAt),DATE_FORMAT)}
                                    isUpdated={message?.updatedAt !== message?.createdAt}
                                    socketQuery={socketQuery}
                                    
                                    socketUrl={socketUrl}
                                    />
                                 </div>
                            ))}
                        </Fragment>
                    ))}
                </div>
                <div ref={BottomRef}/>
            </div>
    
    )
}
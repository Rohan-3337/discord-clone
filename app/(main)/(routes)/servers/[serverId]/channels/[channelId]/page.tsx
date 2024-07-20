import { ChatHeader } from "@/components/chat/Chat-header";
import { ChatInput } from "@/components/chat/Chat-input";
import { ChatMessage } from "@/components/chat/Chat-message";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps{
    params:{
        serverId:string;
        channelId:string;
    }
}

const ChannelIdPage =async({params}:ChannelIdPageProps)=>{
    const profile = await currentProfile();
    const {serverId,channelId} = params;
    if(!profile){
        return redirect("/sign-in");
    }
    const channel = await db.channel.findFirst({
        where:{
            id:params.channelId,
        }
    })
    const member = await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile?.id,

        }
    })
    if(!member || !channel){
        redirect("/");
    }
    
console.log(channel.type);
 return(
    <div className=" bg-white dark:bg-[#313338] flex flex-col h-[100vh]">
        <ChatHeader
         name={channel?.name} 
         serverId={channel.serverId}
          type="channel"/>
          {channel.type === ChannelType.TEXT &&(
            <>
            <ChatMessage
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/sockets/messages"
            socketQuery={{
                channelId:channel?.id,
                serverId:channel.serverId
            }}
            paramKey="channelId"
            paramValue={channel.id}/>

<ChatInput apiUrl="/api/sockets/messages" type="channel" name={channel.name} query={{
            channelId:channel?.id,
            serverId:params.serverId,
        }}/>
            </>
          )}
          {channel.type === ChannelType.AUDIO && (
            <MediaRoom
            chatId={channel.id}
            video={false}
            audio={true}
            />
          )}
          {channel.type === ChannelType.VIDEO && (
            <MediaRoom
            chatId={channel.id}
            video={true}
            audio={true}
            />
          )}
        
        
    </div>
 )
}
export default ChannelIdPage;
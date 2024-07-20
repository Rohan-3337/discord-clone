
import { ChatHeader } from "@/components/chat/Chat-header";
import { ChatInput } from "@/components/chat/Chat-input";
import { ChatMessage } from "@/components/chat/Chat-message";
import { MediaRoom } from "@/components/media-room";
import { GetorCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";


interface MemberIdPageProps{
  params:{
    serverId:string;
    memberId:string;
  };
  searchParam:{
    video?:boolean;
  }

}
const MemberIdPage = async({params,searchParam}:MemberIdPageProps) => {
  
  const profile = await currentProfile();
 
  
  
  if(!profile){
    return redirect("/sign-in");
  }
  const currentmember = await db.member.findFirst({
    where:{
      serverId:params.serverId,
      profileId:profile?.id,
    },
    include:{
      profile:true,
    }
  });
  if(!currentmember){
    return redirect("/");
  }
  const conversation = await GetorCreateConversation(currentmember.id,params.memberId);
  if(!conversation){
    return redirect(`/servers/${params.serverId}`);
  }
  
  const {memberOne,memberTwo} = conversation;
  const othermembers = memberOne.profileId === profile.id ? memberTwo :memberOne;


  return (
    
    <div className=" bg-white dark:bg-[#313338] flex flex-col h-[100vh]">

      {searchParam?.video && (
        <MediaRoom chatId={conversation.id} audio={true} video={true}/>
      )}
      {!searchParam?.video &&(
        <>
<ChatHeader imageUrl={othermembers.profile.imageUrl} name={othermembers.profile.name}
      serverId={params.serverId}
      type="conversation"/>
      <ChatMessage member={currentmember}
      name={othermembers.profile.name}
      chatId={conversation.id}
      type="conversation"
      apiUrl="/api/direct-messages"
      paramKey="conversationId"
      paramValue={conversation.id}
      socketUrl="/api/sockets/direct-messages"
      socketQuery={{
        conversationId:conversation.id,
      }}/>
      <ChatInput
      name={othermembers.profile.name}
      type="conversation"
      apiUrl="/api/sockets/direct-messages"
      query={
        {
          conversationId:conversation.id,
        }
      }
      />



        </>
      )}
      
    </div>
  ) 
}

export default MemberIdPage
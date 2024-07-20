import { currentProfilePage } from "@/lib/current-profile-page";
import { db } from "@/lib/db";
import { NextApiResponseIO } from "@/type";
import { MemberRole } from "@prisma/client";
import { NextApiRequest} from "next";


export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseIO
){
      if(req.method!=="DELETE" && req.method !=="PATCH"){
        return res.status(404).json({error:"METHOD not allowed"})
      }
      try {
        const profile = await currentProfilePage(req);
        const {messageId,serverId,channelId} = req.query;
        const {content} = req.body;
        if(!profile){
            return res.status(401).json({error:"Unauthorized"});
        }
        if(!serverId){
            return res.status(400).json({error:"ServerId is missing"});
        }
        if(!channelId){
            return res.status(400).json({error:"ServerId is missing"});
        }
        const server = await db.server.findFirst({
            where:{
                id: serverId as string,
                members:{
                    some:{
                        profileId:profile.id,
                    }
                }
            },
            include:{
                members:true,
            }
        });
        if(!server){
            return res.status(404).json({error:"server is not found"});
        }
        const channel = await db.channel.findFirst({
            where:{
                id: channelId as string,
                serverId:serverId as string
            }
        })
        if(!channel){
            return res.status(404).json({error:"channel is not found"});
        }
        const member = server.members.find((member) => member.profileId === profile.id);
        if(!member){
            return res.status(404).json({error:"member is not found"});
        }
        let message = await db.message.findFirst({
            where:{
                id:messageId as string,
                channelId:channelId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        if(!message || message.deleted){
            return res.status(404).json({error:"Message not Found"});
        }
        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify =isMessageOwner || isAdmin || isModerator
        if(!canModify){
            return res.status(401).json({error:"UnAuthorized"})
        }
        if(req.method === "DELETE"){
            message = await db.message.update({
                where:{
                    id:message.id,
                },
                data:{
                    fileUrl:null,
                    content:"this message has been deleted",
                    deleted:true,
                },
                include:{
                    member:{
                        include:{
                            profile:true,
                        }
                    }
                }
            })
        }
        if(req.method === "PATCH"){
        
            if(!isMessageOwner){
                return res.status(401).json({error:"Unauthorized"});
            }
            message = await db.message.update({
                where:{
                    id:message.id,
                },
                data:{
                    
                    content,
                    
                },
                include:{
                    member:{
                        include:{
                            profile:true,
                        }
                    }
                }
            });
            
        }
        const updateKey = `chat:${channelId}:messages:update`;
            res?.socket?.server?.io?.emit(updateKey, message);
            
        return res.status(200).json(message);
      } catch (error) {
        console.log("MESSAGE_ID",error);
        return res.status(404).json({error:"Internal Server Error"});
      }
}
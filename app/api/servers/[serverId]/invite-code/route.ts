import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"
export async function PATCH(
    req: Request,
    {params}: {params:{serverId:string}},
){
    try {
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status: 401});
        }
        if(!params.serverId){
            return new NextResponse("Server ID is missing",{status: 400}); 
        }
        const server  = await db.server.update({
            where:{
                profileId:profile?.id,
                id:params?.serverId,
            },
            data:{
                inviteCode:uuidv4()
            }
        })
        return NextResponse.json(server);
    } catch (error) {
    //    console.error(error,"SERVERID ERROR");
       return new NextResponse("internal error",{status:500}); 
    }
}
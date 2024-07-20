import { db } from "@/lib/db";
import { auth, getAuth } from "@clerk/nextjs/server"



export const currentProfile = async ()=>{
    const {userId} = auth();
    if(!userId) return null;

    const profile = await db.profile.findUnique({
        where:{
            userId: userId
        }
    });
    return profile;

}

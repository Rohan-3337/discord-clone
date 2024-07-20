import { redirect } from 'next/navigation';
import { currentUser } from "@clerk/nextjs/server"
import { db } from './db';


export const intialProfile = async()=>{
    const user = await currentUser();
    if(!user){
         return redirect("/sign-in");
}
    const profile = await db.profile.findUnique({
        where:{
            userId: user?.id,
        }
    })
    if(profile){
        return profile;
    }
    const newProfile = await db.profile.create({
        data:{
            userId: user?.id,
            name : `${user?.firstName}`,
            imageUrl:`${user?.imageUrl}`,
            email:`${user?.emailAddresses[0].emailAddress}`,

        }
    });
    return newProfile;
}
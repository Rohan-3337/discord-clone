import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(req:Request,params:{params:{memberId:string}}){
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        
        const serverId = searchParams.get('serverId');
        const {memberId} = params?.params;

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});

        }
        if(!serverId){
            return new NextResponse("ServerId is missing", {status: 400});
        }
        if(!memberId){
            return new NextResponse("MemberId is missing", {status: 400});
        }
        const server = await db.server.update({
            where:{
                id: serverId,
                profileId:profile?.id,
            },
            data:{
                members:{
                    delete:{
                        id:memberId,
                        profileId:{
                            not:profile?.id
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                },
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal server error",{status:500})
    }
}
export async function PATCH(req:Request,params:{params:{memberId:string}}){
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const {role} = await req.json();
        const serverId = searchParams.get('serverId');
        const {memberId} = params?.params;

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});

        }
        if(!serverId){
            return new NextResponse("ServerId is missing", {status: 400});
        }
        if(!memberId){
            return new NextResponse("MemberId is missing", {status: 400});
        }
        const server = await db.server.update({
            where:{
                id:serverId,
                profileId:profile?.id,
            },
            data:{
                members:{
                    update:{
                        where:{
                            id:memberId,
                            profileId:{
                                not:profile?.id,
                            }
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true,
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal server error",{status:500})
    }
}
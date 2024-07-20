"use client"

import { useEffect,useState} from "react"
// import{ControlBar, LiveKitRoom,RoomAudioRenderer,VideoConference} from "@livekit/components-react"
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
  } from "@livekit/components-react";
  import "@livekit/components-styles";
import { Track } from "livekit-client";

import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import "@livekit/components-styles"

interface MediaRoomProps{
    chatId:string,
    video:boolean,
    audio:boolean,
}

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false },
    );
    return (
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
        {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    );
  }
export const MediaRoom = ({chatId,video,audio}:MediaRoomProps) =>{
    const {user} = useUser();
    const [token,setToken] =useState("");
    useEffect(()=>{
        if(!user?.firstName){
            return;
        }
        const name = user?.firstName;
        (async()=>{
            try {
                const res = await fetch(`/api/livekit/?room=${chatId}&username=${name}`);
                const data = await res.json();
                setToken(data.token)
                
            } catch (error) {
                console.log(error);
            }
        })();
    },[user?.firstName,chatId])
    if(token===""){
        return(
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className=" h-7 w-7 text-zinc-500 animate-spin dark:text-zinc-400"/>
                <p className="text-xs dark:text-zinc-400 text-zinc-500 ">
                    Loading....
                </p>
            </div>
        )
    }
    return(
        <LiveKitRoom data-lk-theme="default" serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        audio={audio}
        video={video}
    
        >
            
            <MyVideoConference />
      
      <RoomAudioRenderer />
      
      <ControlBar />
     
    
        </LiveKitRoom>
    )
}
"use client"

import { Smile } from "lucide-react";
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useTheme } from "next-themes";


interface EmojiPickerProps{
    onChange:(value:string)=>void;

}

export const EmojiPicker = ({onChange}:EmojiPickerProps) =>{
    const {resolvedTheme} =  useTheme();
    return (
        <Popover>
            <PopoverTrigger>
                <Smile className=" text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
                <PopoverContent
                side="right"
                sideOffset={40}
                className=" bg-transparent border-none shadow-none drop-shadow-none mb-16">
                        <Picker
                        theme={resolvedTheme}
                        data={data}
                        onEmojiSelect={(emoji:any)=>onChange(emoji.native)}
                        />
                </PopoverContent>
            </PopoverTrigger>
        </Popover>
    )
}
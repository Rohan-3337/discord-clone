"use client"


import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import "@uploadthing/react/styles.css";
interface FileUploadProps{
    onChange:(url?:string) => void;
    value?:string;
    endpoint:"messageFile"| "serverImage";

}

export const FileUpload = ({onChange,value,endpoint}:FileUploadProps) =>{
    const fileType = value?.split(".").pop();
    if(value &&fileType !=="pdf"){
        return (
            <div className="h-20 w-20 relative">
                <Image fill src={value} alt="upload" className=" rounded-full"/>
                <button className=" bg-rose-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm"
                onClick={()=>onChange("")}
                type="button">
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
    if(value && fileType==="pdf"){
        return(
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                <a href={value} target="_blank" rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">{value}</a>
                <button className=" bg-rose-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm"
                onClick={()=>onChange("")}
                type="button">
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
    return <>
    <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          onChange(res?.[0].url);
          
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
}
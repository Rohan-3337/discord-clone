"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import * as z from "zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FileUpload } from "../file-upload"
import { useParams, useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { ChannelType } from "@prisma/client"
import qs from "query-string"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect } from "react"

const formSchema =  z.object({
    name:z.string().min(2,{
        message:"Channel name is required"
    }).refine(
        name =>name!=="general",
        {
            message:"Channel name Cannot be general"
        }
    ),
    type:z.nativeEnum(ChannelType),

})


export const EditChannelModal = ()=>{
    const {isOpen,type,anClose,data} = useModal();
    const isModalOpen = isOpen && type==="editChannel";
    const router = useRouter();
    const params = useParams();
    const {channel} = data;
    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
             name:"",
             type:channel?.type||ChannelType.TEXT,        
    },
    
    });
    useEffect(() => {
      if(channel){
        form?.setValue("type",channel?.type);
        form?.setValue("name",channel?.name);
      }else{
        form.setValue("type",ChannelType.TEXT);
      }
    
      
    }, [channel,form])
    
    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl(
                {
                    url:`/api/channels/${channel?.id}`,
                    query:{
                        serverId:params?.serverId
                    }
                }
            )
            const res = await axios.patch(url,value);
            
            
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
      };
      
      const onError = (errors: any) => {
        console.error("Form validation errors:", errors);
      };
    const isLoading = form.formState.isSubmitting;
     const handleChange = ()=>{
        if(channel){
            form?.setValue("type",channel?.type);
            form?.setValue("name",channel?.name);
          }else{
            form.setValue("type",ChannelType.TEXT);
          }
        anClose();
     }   
    
    return(
        <Dialog open={isModalOpen} onOpenChange={handleChange}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    Edit Your Channel
                </DialogTitle>
                
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)}  className="space-y-8">
                        <div className="space-y-8 px-6">
                            
                            <FormField control={form.control} name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                                        focus-visible:ring-offset-0"
                                        placeholder="Enter Channel Name"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField
                            control={form.control}
                            name="type"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Channel Type</FormLabel>
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 capitalize outline-none">
                                                <SelectValue placeholder="Select a Channel Type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(ChannelType).map((type)=>(
                                                    <SelectItem key={type} value={type} className="capitalize">
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                            
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant={"primary"} disabled={isLoading} type="submit">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
} 

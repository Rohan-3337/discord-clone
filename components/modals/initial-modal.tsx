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
import { useEffect, useState } from "react"
import { FileUpload } from "../file-upload"
import { useRouter } from "next/navigation"

const formSchema =  z.object({
    name:z.string().min(2,{
        message:"Server name is required"
    }),
    imageUrl:z.string().min(1,{
        message:"Image URL is required"
    })

})


export const InitialModal = ()=>{
    const [isMounted,serIsMounted] = useState(false);
    useEffect(()=>{
        serIsMounted(true);
        
    },[])
    const router = useRouter();
    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
             name:"",
             imageUrl:"",
             
    }
    });
    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", value);
            form.reset(); 
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
        
     if(!isMounted){
        return null;
    }
    return(
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    Customize your server
                </DialogTitle>
                <DialogDescription className=" capitalize text-center text-zinc-500">
                    give your server personality with a name and an image. you can always change it later
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)}  className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                            <FormField control={form.control} name="imageUrl"
                            render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload value={field.value} onChange={field.onChange} endpoint="serverImage"/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                            <FormField control={form.control} name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                                        focus-visible:ring-offset-0"
                                        placeholder="Enter Server Name"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant={"primary"} disabled={isLoading} type="submit">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}
"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import * as z from "zod"
import axios from "axios"
import qs from "query-string"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { FileUpload } from "../file-upload"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"

const formSchema =  z.object({
    
    fileUrl:z.string().min(1,{
        message:"File URL is required"
    })

})


export const MessageFileModal = ()=>{
    const {isOpen,anClose,type,data} = useModal();
    
    const router = useRouter();
    const ModalOpen = isOpen && type ==="messageFile";
    const {apiUrl,query} = data;
    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            
             fileUrl:"",
             
    }
    });
    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url:apiUrl || "",
                query

            })
            await axios.post(url, {
                ...value,
                content:value?.fileUrl,
            });
            form.reset(); 
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
      };
      
      const onError = (errors: any) => {
        console.error("Form validation errors:", errors);
      };
      const handleClose = () =>{
        form.reset();
        anClose();
      }
    const isLoading = form.formState.isSubmitting;
        
   
    return(
        <Dialog open={ModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    Add an Attachments
                </DialogTitle>
                <DialogDescription className=" capitalize text-center text-zinc-500">
                    Send a File as a Messages
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)}  className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                            <FormField control={form.control} name="fileUrl"
                            render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload value={field.value} onChange={field.onChange} endpoint="messageFile"/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                            

                            
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant={"primary"} disabled={isLoading} type="submit">
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}
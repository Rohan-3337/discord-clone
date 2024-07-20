import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef:React.RefObject<HTMLDivElement>;
    bottomRef:React.RefObject<HTMLDivElement>;
    shouldLoadMore:boolean;
    loadMore:()=>void;
    count:number;
}

export const useChatScroll = ({chatRef,bottomRef,shouldLoadMore,loadMore,count}:ChatScrollProps) =>{
    const [hasInitialized, setHasInitialized] = useState(false);
    useEffect(()=>{
        const topDiv = chatRef?.current;
        const handleScroll = () =>{
            const scrollTop = topDiv?.scrollTop;
            if(scrollTop ===0 && shouldLoadMore ){
                loadMore();
            }
        }
        topDiv?.addEventListener("scroll", handleScroll);
        return () =>{
            topDiv?.removeEventListener("scroll", handleScroll);
        }
    },[shouldLoadMore,loadMore,count]);
    useEffect(()=>{
        const bottomdiv = bottomRef?.current;
        const topDiv = chatRef?.current;
        const shouldAutoscroll = () =>{
            if(!hasInitialized && bottomdiv){
                setHasInitialized(true);
                return true;
            }
            if(topDiv?.scrollHeight && topDiv?.scrollTop && topDiv?.clientHeight){
                const Distancefrombottom = topDiv?.scrollHeight - topDiv?.scrollTop  - topDiv?.clientHeight;
                return Distancefrombottom<= 100;

            }
        }
        if(shouldAutoscroll()){
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior:"smooth"
                })
            }, 100);
        }
    },[bottomRef,chatRef,count,hasInitialized])

}
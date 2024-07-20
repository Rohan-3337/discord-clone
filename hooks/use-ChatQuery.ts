import { useSocket } from "@/components/providers/Socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import qs from "query-string";


interface ChatQueryProps{
    queryKey: string;
    apiUrl: string;

    paramKey:"channelId" | "conversationId";
    paramValue: string;
}
export const useChatQuery = ({queryKey,apiUrl,paramKey,paramValue}:ChatQueryProps) =>{
    const {isConnected} = useSocket();
    const params = useParams();
    const fetchMessages = async ({ pageParam = undefined }:{pageParam?:number}) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query:{
                cursor:pageParam,
                [paramKey]:paramValue,

            }
        },{skipNull:true});
        const res = await fetch(url);
        return res.json();

    }
    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        status,
      } = useInfiniteQuery({
        queryKey:[queryKey],
        queryFn:fetchMessages,
        initialPageParam:undefined,
        getNextPageParam:(lastpage) => lastpage?.nextCursor 
        ,refetchInterval: isConnected ? false : 1000,
      });
      return {
        data,
        isFetchingNextPage,
        status,
        hasNextPage,
        fetchNextPage
      }
}
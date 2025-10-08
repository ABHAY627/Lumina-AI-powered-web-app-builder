// "use client";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { useTRPC } from "@/trpc/client";
import {caller, getQueryClient ,trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import { de, tr } from "date-fns/locale";
import {Client} from "./client";
import { Suspense } from "react";
//accessing data through prisma client 

const Page = async () => {

  const QueryClient=getQueryClient();
  //just for the sake of early initialization of the fetch request 
  // since the server side is rendered before the client side
  // so to make it very fast and agile

  //this should be always void because we are not actually using the data here , we are just prefetching it
  // and passing it to the client side through hydration boundary
  // so that the client side can use it without making another request

  void QueryClient.prefetchQuery(trpc.createAI.queryOptions({text:"Abhay Prefetch"}));

  // here we are trying to access the both , the speed of server components and the familiarity of client components
  // so we are using the suspense boundary to wrap the client component
  // and passing the prefetched data to the client component through hydration boundary
  return ( 
      <HydrationBoundary state={dehydrate(QueryClient)}>
        <Suspense fallback={<div>Loading...</div>} >
        <Client/>
        </Suspense>
      </HydrationBoundary>
   );
}
 
export default Page;
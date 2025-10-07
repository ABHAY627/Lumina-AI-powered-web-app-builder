"use client";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
//accessing data through prisma client 

const Page = () => {
  
  // const users = await prisma.user.findMany();
  // const posts = await prisma.post.findMany();
  // console.log(users);
  // console.log(posts);
  const trpc=useTRPC();
  // trpc.createAI.queryOptions({text:"abhay"});
  const {data} = useQuery(trpc.createAI.queryOptions({text:"abhay"}));
  return ( 
    <div>
      <Button>Hello World!</Button>
      <div>{JSON.stringify(data)}</div>
      {/* {JSON.stringify(users,null,2 )}
      {JSON.stringify(posts,null,2 )} */}
    </div>
   );
}
 
export default Page;
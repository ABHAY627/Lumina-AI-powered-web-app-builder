// "use client";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useQuery } from "@tanstack/react-query";
//accessing data through prisma client 

const Page = async () => {
  
  // const users = await prisma.user.findMany();
  // const posts = await prisma.post.findMany();
  // console.log(users);
  // console.log(posts);

  // using it with the help of trpc client component 
  // const trpc=useTRPC();
  
  // const {data} = useQuery(trpc.createAI.queryOptions({text:"abhay"}));

  //now fetching the data using trpc server caller function
  const data = await caller.createAI({text:"Abhay Gautam"});

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
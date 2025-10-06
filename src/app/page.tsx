import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
//accessing data through prisma client 

const Page = async () => {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  console.log(users);
  console.log(posts);
  return ( 
    <div>
      <Button>Hello World!</Button>
      {JSON.stringify(users,null,2 )}
      {JSON.stringify(posts,null,2 )}
    </div>
   );
}
 
export default Page;
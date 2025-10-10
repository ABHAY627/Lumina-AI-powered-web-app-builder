"use client";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { useTRPC } from "@/trpc/client";
import {caller, getQueryClient ,trpc } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


//please remember thst only server components can be async functions 
const Page = () => {
  const trpc=useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess : () => {
      toast.success("Background job invoked!");
    }
  }));
  return ( 
    <div>
      <button  disabled = {invoke.isPending} onClick ={() => invoke.mutate({ text: "john" })} className="bg-blue-500 text-white px-4 py-2 rounded">
        invoke background job   
      </button>
    </div>
   );
}
 
export default Page;
"use client";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { useTRPC } from "@/trpc/client";
import React from "react";
import {caller, getQueryClient ,trpc } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";


//please remember thst only server components can be async functions 
const Page = () => {
  const trpc=useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess : () => {
      toast.success("Background job invoked!");
    }
  }));
  const [value, setValue] = React.useState("");

  return ( 
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter the command" className="mb-4" />
      <button  disabled = {invoke.isPending} onClick ={() => invoke.mutate({ value: value })} className="bg-blue-500 text-white px-4 py-2 rounded">
        invoke background job   
      </button>
    </div>
   );
}
 
export default Page;
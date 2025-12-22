"use client";
import { useTRPC } from "@/trpc/client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Page = () => {
  const trpc = useTRPC();
  const invoke = useMutation<{ success: boolean }, unknown, { value: string }>(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Background job invoked!");
      },
    }),
  );
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
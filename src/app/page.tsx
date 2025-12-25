"use client";
import { useTRPC } from "@/trpc/client";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Page = () => {
  const trpc = useTRPC();
  const {data:messages} = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message Created!");
      },
    }),
  );
  const [value, setValue] = React.useState("");

  return ( 
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter the command" className="mb-4" />
      <button  disabled = {createMessage.isPending} onClick ={() => createMessage.mutate({ value: value })} className="bg-blue-500 text-white px-4 py-2 rounded">
        invoke background job   
      </button>
      {JSON.stringify(messages,null,2)};
    </div>
   );
}
 
export default Page;
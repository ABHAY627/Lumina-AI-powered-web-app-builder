"use client";
import { useTRPC } from "@/trpc/client";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Page = () => {
  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (err) => {
        toast.error(`Error creating project: ${err.message}`);
      },
      onSuccess: () => {
        toast.success("Project Created!");
      },
    }),
  );
  const [value, setValue] = React.useState("");

  return ( 
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-y-4 mx-auto max-w-7xl px-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter the command" className="mb-4" />
        <button  disabled = {createProject.isPending} onClick ={() => createProject.mutate({ value: value })} className="bg-blue-500 text-white px-4 py-2 rounded">
          SUBMIT Prompt
        </button>
      </div>
    </div>
   );
}
 
export default Page;
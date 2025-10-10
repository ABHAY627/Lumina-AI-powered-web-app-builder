"use client";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { useTRPC } from "@/trpc/client";
import {caller, getQueryClient ,trpc } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";

const Page = async () => {
  
  return ( 
    <div>
      <button>
        invoke background job   
      </button>
    </div>
   );
}
 
export default Page;
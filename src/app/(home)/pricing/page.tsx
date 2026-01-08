"use client"

import Image from "next/image"
import { PricingTable } from "@clerk/nextjs"
import {dark} from "@clerk/themes";
import React from "react"
import { useCurrentTheme } from "@/hooks/use-current-theme";

const Page = () => {
    const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full px-4">
      <section className="space-y-8 pt-[16vh] 2xl:pt-48 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Lumina"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>

        <h1 className="text-xl md:text-3xl font-bold text-center">
          Pricing
        </h1>

        <p className="text-muted-foreground text-center text-sm md:text-base">
          Choose the plan that fits your needs
        </p>

        <div className="w-full max-w-5xl mx-auto">
          <PricingTable
            appearance={{
                baseTheme:currentTheme==="dark" ? dark:undefined,
              elements: {
                pricingTableCard: "border! shadow-none! rounded-xl!",
              },
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default Page

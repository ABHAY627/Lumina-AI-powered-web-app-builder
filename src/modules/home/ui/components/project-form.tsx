"use client";

import { z } from "zod";
import { toast } from "sonner";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { is, tr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";
import { useClerk } from "@clerk/nextjs";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

export const ProjectForm = () => {
    const clerk = useClerk();

    const trpc = useTRPC();
    const queryClient = useQueryClient();   
    const router = useRouter();
    const form = useForm <z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });
    const createProject = useMutation(trpc.projects.create.mutationOptions(
        {
            onSuccess: (data) => {
                form.reset();
                queryClient.invalidateQueries(
                    trpc.projects.getMany.queryOptions(),
                );
                queryClient.invalidateQueries(
                    trpc.usage.status.queryOptions(),
                );
                router.push(`/projects/${data.id}`);
            },      

            onError: (err) => {
                toast.error(err.message);
                if(err.data?.code==="UNAUTHORIZED"){
                    clerk.openSignIn();
                    // one more way
                    // router.push("/sign-in")
                }
                if(err.data?.code==="TOO_MANY_REQUESTS"){
                    router.push("/pricing");
                }
            }
        },
    ));
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createProject.mutateAsync({
            value: values.value,
        });
    };
    const [isFocussed,setIsFocussed] = useState(false); 
    const isPending = createProject.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid;

    return (
        <Form {...form}>
            <section className="mb-6">
                <form
                onSubmit={form.handleSubmit((onSubmit))}
                className={cn("relative-border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                    isFocussed && "shadow-xs",
                )}
                >  
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocussed(true)}
                            onBlur={() => setIsFocussed(false)}
                            minRows={2}
                            maxRows={8}
                            className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                            placeholder="What would you like to build?"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)(e);
                                }
                            }}
                        />
                    )}
                />
                    <div className="flex gap-x-2 items-end justify-between pt-2">
                        <div className="text-[10px] text-muted-foreground font-mono">
                            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            <span>&#8984;</span>Enter
                            </kbd>
                            &nbsp;to submit
                        </div>

                        <Button 
                            disabled={isButtonDisabled}
                            className={cn(
                                "size-8 rounded-full",
                                isButtonDisabled && "bg-muted-foreground border",
                            )}
                        >
                        {isPending ? (<Loader2Icon className="size-4 animate-spin" />) : (<ArrowUpIcon />)}
                        </Button>
                    </div>

                </form>
            </section>
            <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
                    {PROJECT_TEMPLATES.map((template) => (
                        <Button 
                            key={template.title}
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                                form.setValue("value", template.prompt,{
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                });
                                form.handleSubmit(onSubmit)();
                            }}
                            size="sm"
                        >
                            <span>{template.emoji}</span>
                            <span>{template.title}</span>
                        </Button>
                    ))}
            </div>
        </Form>
    );
};

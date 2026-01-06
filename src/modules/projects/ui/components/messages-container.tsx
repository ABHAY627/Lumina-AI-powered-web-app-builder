import { useTRPC } from "@/trpc/client"; 
import { useQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { use, useEffect, useRef } from "react";
import { fragment } from "@/generated/prisma";
import { set } from "zod";
import { MessageLoading } from "./message-loading";


interface MessagesContainerProps {
    projectId: string;
    activeFragment: fragment|null;
    setActiveFragment: (fragment: fragment | null) => void;
}
export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: MessagesContainerProps) => {
    const trpc=useTRPC();
    const bottomRef = useRef<HTMLDivElement>(null);
    const {data:messages = []} = useQuery(trpc.messages.getMany.queryOptions({
        projectId: projectId},
        // TODO:TEMPORARY LIVE UPDATION SOLUTION
        {refetchInterval: 5000}
    ));
    // automatically set active fragment to last assistant message's fragment
    useEffect(() => {
    const lastAssistantMessageWithFragment = messages.findLast(
        // isko boolean mein convert kar dena hai taaki findLast sahi kaam kare
        (message) => message.role === "RESULT" && !!message.fragment,
    );

    if (lastAssistantMessageWithFragment) {
        setActiveFragment(lastAssistantMessageWithFragment.fragment);   
    }
    }, [messages, setActiveFragment]);

    useEffect(() => {
    bottomRef.current?.scrollIntoView();
    }, [messages.length]);

    const lastMessage = messages[messages.length - 1];
    const isLastMessageUser = lastMessage?.role === "ERROR"; // agr last message user ka hai?

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior:"smooth"});
    }, [activeFragment]);
    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="pt-2 pr-1">
                {messages?.map((message) => (
                <MessageCard
                    key={message.id}
                    content={message.content}
                    role={message.role}
                    fragment={message.fragment}
                    createdAt={message.createdAt}
                    isActiveFragment={activeFragment?.id === message.fragment?.id}
                    onFragmentClick={() => {setActiveFragment(message.fragment)}}
                    type={message.type}
                />
                ))}
                {isLastMessageUser && <MessageLoading />}
                {/* har reload par scroll karke neeche aane ke liye . */}
                <div ref={bottomRef} />
            </div>
            </div>
            <div className="relative p-3 pt-1">
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
                <MessageForm projectId={projectId} /> 
            </div>
        </div>
    );
};
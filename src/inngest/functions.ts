import { Agent, createAgent, createNetwork, createTool,gemini,Tool } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z, { string } from "zod";
import { stdout } from "process";
import path from "path";
import { Network } from "inspector/promises";
import { create } from "domain";
import { PROMPT } from "@/prompt";
import { Code } from "lucide-react";
import { prisma } from "@/lib/db";
import { messageRole, messageType } from "@/generated/prisma";

interface Agentstate {
  summary : string ;
  files : {[path:string]:string} ;
};

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("lumina-next-app");
      return sandbox.sandboxId; 
    });

    const agent = createAgent<Agentstate>({
        // name: "Summarizer",
        name: "CodeAgent", 
        description : "An Expert Coding Agent", 
        system: PROMPT,
        model: gemini({ 
          model: "gemini-2.5-flash",
          // generationConfig:{
          //   temperature:0.2,
          //   maxOutputTokens: 1024,
          // }
        }),
        tools:[
          createTool({
            name: "terminal",
            description: "Use this tool to run terminal commands in the code interpreter sandbox.",
            parameters: z.object({
              command: z.string(),
            }),
            handler : async ({ command },{step}) => {
              return await step?.run("terminal",async() => {
                const bufffer = {stdout:"", stderr:""};
                try{
                  const sandbox = await getSandbox(sandboxId);
                  const result = await sandbox.commands.run(command, {
                    background: false,
                    onStdout: (data: string) => {
                      bufffer.stdout += data;
                    },
                    onStderr: (data: string) => {
                      bufffer.stderr += data;
                    }
                  });
                  return result.stdout; 
                }
                catch(err){
                  console.error(  
                    `Command failed: ${err}\nstdout: ${bufffer.stdout}\nstderr: ${bufffer.stderr}`,
                  );
                  return `Command failed: ${err}\nstdout: ${bufffer.stdout}\nstderr: ${bufffer.stderr}`;
                }
              });
            },
          }),
          createTool({
            name:"createOrUpdateFiles",
            description:"Use this tool to create or update files in the code interpreter sandbox.",
            parameters: z.object({
              files: z.array(
                z.object({
                  path: z.string(),
                  content: z.string(),
                }),
              ),
            }),
            handler: async ({files},{step,network}:Tool.Options<Agentstate>) => {
              const newFiles =  await step?.run("create-or-update-files",async() => {
                try{
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for(const file of files){
                    await sandbox.files.write(file.path,file.content); 
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                }catch(err){
                  return "Error creating or updating files:" +  err;
                }
              });
              if(typeof newFiles === "object"){
                network.state.data.files = newFiles;
              }
            }, 
          }),
          createTool({
            name:"readFiles",
            description:"Use this tool to read files from the code interpreter sandbox.",
            parameters: z.object({
              files:z.array(z.string()),
            }),
            handler: async ({files},{step}) => {
              return await step?.run("read-files",async() => {
                try{
                  const sandbox = await getSandbox(sandboxId);
                  const contents = [];
                  for(const file of files){
                    const content = await sandbox.files.read(file);
                    contents.push({path:file, content});
                  }
                  return JSON.stringify(contents);  
                }catch(err){
                  return "Error reading files:" + err;
                }
              });
            },
          })
        ],
        lifecycle: {
          onResponse: async ({result,network}) => {
            const lastAssistantTextMessage = lastAssistantTextMessageContent(result);
            if(lastAssistantTextMessage && network){
              if(lastAssistantTextMessage.includes("<task_summary>")){
                network.state.data.summary = lastAssistantTextMessage;
              }
            } 
            return result;
          },
        },
    }); 

    const network = createNetwork<Agentstate>({
      name: "Code-agent-Network",
      agents: [agent],
      maxIter: 5,

      // state: {
      //   data: {
      //     files: {},
      //     summary: "",
      //   },
      // },

      router: async ({ network }) => {
        if (network.state.data.summary) return;
        return agent;
      },
    });

    //ye initial phase main kiya tha , ab kaam network se ho jaega .
    // const {output} = await step.run("run-agent", async () => {
    //   return await agent.run(`${event.data.value}`);
    // });

    // ab ye naya tareeka hai , network ke through karne ka .
    const result = await network.run(`${event.data.value}`);

    const isError =
    !result.state.data.summary ||
    Object.keys(result.state.data.files || {}).length === 0;

  
    const sandboxUrl = await step.run("start-server-and-get-url", async () => {
      try {
        const sandbox = await getSandbox(sandboxId);
        
        await sandbox.commands.run(
          "HOST=0.0.0.0 PORT=3000 npm run dev",
          { background: true }
        );

        // wait for server to boot
        await new Promise((r) => setTimeout(r, 8000));

        const host = sandbox.getHost(3000);
        return `https://${host}`;
      } catch (err) {
        console.error("Failed to start server:", err);
        throw err;
      }
    });

    await step.run("save-result", async () => {
      if(isError){
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Error generating fragment. Please try again.",  
            role: messageRole.RESULT,
            type: messageType.FRAGMENT,
          },
        });
      }
      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: result.state.data.summary,
          role: messageRole.RESULT,
          type: messageType.FRAGMENT,
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              titles: "Fragment",
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url:sandboxUrl,
      title:"Fragment",
      files:result.state.data.files,
      summary:result.state.data.summary,
     };
  },
);
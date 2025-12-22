import { createAgent, gemini } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("lumina-next-app");
      return sandbox.sandboxId; 
    });

    const agent = createAgent({
        // name: "Summarizer",
        name: "Code writer",
        // system: "You are an expert summarizer, you summarize in 2 words.",
        system: "You are an expert Next.js developer . You write readable ,maintanable codes for scalable web apps using React.js and Next.js snippets.",
        model: gemini({ model: "gemini-2.5-flash" }),
    }); 

    const {output} = await agent.run(`${event.data.value}`);

    const sandboxUrl = await step.run("start-server-and-get-url", async () => {
      const sandbox = await getSandbox(sandboxId);



      await sandbox.commands.run(
        "HOST=0.0.0.0 PORT=3000 npm run dev",
        { background: true }
      );

      // wait for server to boot
      await new Promise((r) => setTimeout(r, 8000));



      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    // success message 
    return {output , sandboxUrl};
  },
);
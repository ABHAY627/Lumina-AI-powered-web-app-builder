import { createAgent, grok } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const agent = createAgent({
        name: "Code writer",
        system: "You are an expert Summarizer . You summarize in two words",
        model: grok({ model: "grok-4-latest" }),
    });

    const {output} = await agent.run(`Summarise the following text: ${event.data.value}`);
    // success message 
    return {output};
  },
);
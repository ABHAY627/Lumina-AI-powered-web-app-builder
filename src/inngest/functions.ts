import { createAgent, gemini } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const agent = createAgent({
        name: "Code writer",
        system: "You are an expert React.js software developer . You write codes for scalable web apps using React.js and Next.js. You write clean, efficient, and well-documented code. You are also proficient in using modern JavaScript (ES6+) features and best practices.",
        model: gemini({ model: "gemini-2.5-flash" }),
    }); 

    // const {output} = await agent.run(`Summarise the following text: ${event.data.value}`);
    const {output} = await agent.run(`Make a some of the very beautiful react component specefically a button using react and write the code so that it can work live`);
    // success message 
    return {output};
  },
);
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    //assume this is video transcoding or some other long running task
    await step.sleep("wait-a-moment", "30s");
    //imagine this is some other long running task
    await step.sleep("wait-a-moment", "20s");
    //imagine this is image parsing or doc generation
    await step.sleep("wait-a-moment", "10s");

    // success message 
    return { message: `Hello ${event.data.email}!` };
  },
);
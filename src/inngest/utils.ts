import { Sandbox } from "@e2b/code-interpreter";
import type { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  const sb = await Sandbox.connect(sandboxId);
  return sb;
}

export function lastAssistantTextMessageContent(result: AgentResult): string | undefined {
    // Use the modern `findLastIndex` if available, otherwise fallback to manual search
    const findIdx = typeof result.output?.findLastIndex === "function"
        ? result.output.findLastIndex((message) => message.role === "assistant")
        : (() => {
                for (let i = result.output.length - 1; i >= 0; i--) {
                    if (result.output[i].role === "assistant") return i;
                }
                return -1;
            })();

    if (findIdx === -1) return undefined;

    const message = result.output[findIdx] as TextMessage | undefined;
    if (!message) return undefined;

    const content = message.content;
    if (!content) return undefined;

    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.map((c) => (c as any).text ?? String(c)).join("");

    return undefined;
}
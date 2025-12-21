import {Sandbox} from "@e2b/code-interpreter";

export async function getSandbox(sandboxId: string) {
  const sb = await Sandbox.connect(sandboxId);
  return sb;
}
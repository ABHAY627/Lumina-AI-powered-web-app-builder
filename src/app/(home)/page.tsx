import { ProjectForm } from "@/modules/home/ui/components/project-form";
import Image from "next/image";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";

const Page = () => {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <section className="2-xl:py-48 py-[16vh] items-center justify-center space-y-6">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Lumina"
            width={100}
            height={100}
            className="hidden md:block"
          />
        </div>

        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build Something Amazing with Lumina.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">Create Apps and Websites By Chatting with AI</p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
};

export default Page;

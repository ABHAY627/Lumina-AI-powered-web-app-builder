import { ProjectView } from "@/modules/projects/ui/view/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

interface Props {
  params: {
    projectId: string;
  };
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  // Prefetch EXACT same queries used on client
  await queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    })
  );

  await queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({
      projectId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<div>Loading Project...</div>}>
          <ProjectView projectId={projectId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default Page;

import SendToAIForm from "@/components/form/main-form/send-to-ai-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col gap-4 w-1/2 max-w-1/2 mx-auto">
      <Skeleton className="h-[100px] w-[400px] rounded-md" />
      <Skeleton className="h-[100px] w-[400px] rounded-md self-end" />
      <Skeleton className="h-[200px] w-[450px] rounded-md" />
      <Skeleton className="h-[150px] w-[400px] rounded-md self-end" />
      <Skeleton className="h-[100px] w-[400px] rounded-md" />
      <Skeleton className="h-[100px] w-[400px] rounded-md self-end" />
      <section className="sticky bottom-0 bg-white dark:bg-transparent border-t dark:border-t-gray-800 px-4 py-3 place-items-center">
        <SendToAIForm width="w-full" />
        <footer className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          Nunto AI может допускать ошибки. Проверяйте важную информацию.
        </footer>
      </section>
    </div>
  );
}

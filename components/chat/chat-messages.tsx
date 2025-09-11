import { Message, MessageRole } from "@prisma/client";
import { TvIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { BeatLoader } from "react-spinners";
import { RefObject } from "react";

interface ChatMessagesProps {
  messages: Message[];
  pendingMessages: Message[];
  loading: boolean;
  bottomRef: RefObject<HTMLDivElement | null>;
}

const ChatMessages = ({
  messages,
  pendingMessages,
  loading,
  bottomRef,
}: ChatMessagesProps) => {
  const combined = [...messages, ...pendingMessages];
  return (
    <section className="flex-1 overflow-y-auto px-4 py-6">
      {combined.map((m, i) => (
        <div
          key={m.id || i}
          className={`mb-4 flex  ${
            m.role === MessageRole.USER
              ? "justify-end ml-4"
              : "justify-start mr-4"
          }`}
        >
          {m.role === MessageRole.ASSISTANT && (
            <TvIcon
              className={`size-6 mr-2 shrink-0 flex-start text-gray-500 dark:text-gray-400`}
            />
          )}

          <div
            className={`max-w-[80%] px-4 py-2 rounded shadow prose prose-neutral dark:prose-invert max-w-none
            ${
              m.role === MessageRole.USER
                ? "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100"
                : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100"
            }`}
          >
            {loading && m.role === MessageRole.ASSISTANT && i === combined.length - 1 ? (
              <BeatLoader size={5} color="#ffffff" />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {m.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </section>
  );
};

export default ChatMessages;

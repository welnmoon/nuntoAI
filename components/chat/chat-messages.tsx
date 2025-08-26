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
}: ChatMessagesProps) => (
  <section className="flex-1 overflow-y-auto px-4 py-6">
    {[...messages, ...pendingMessages].map((m, i) => (
      <div
        key={m.id || i}
        className={`mb-4 flex  ${
          m.role === MessageRole.USER
            ? "justify-end ml-4"
            : "justify-start mr-4"
        }`}
      >
        {m.role === MessageRole.ASSISTANT && (
          <TvIcon className={`size-6 mr-2 shrink-0 flex-start`} />
        )}

        <div
          className={`max-w-[80%] px-4 py-2 rounded shadow prose max-w-none
            ${
              m.role === MessageRole.USER
                ? "bg-gray-100 text-gray-800"
                : " text-gray-800"
            }`}
        >
          {loading && m.id === messages[messages.length - 1]?.id ? (
            <BeatLoader size={5} />
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

export default ChatMessages;

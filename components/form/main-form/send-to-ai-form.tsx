"use client";
import { Forward, LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface Props {
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  input?: string;
  setInput?: (value: string) => void;
  loading?: boolean;
  width?: string;
}

const SendToAIForm = ({
  handleSubmit,
  input,
  setInput,
  loading,
  width,
}: Props) => {
  const missingHandlers = !handleSubmit || !setInput || input === undefined;
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) {
      if (!toastIdRef.current) {
        toastIdRef.current = toast.loading("Отвечаем...");
      }
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [loading]);
  const isFormDisabled = missingHandlers;
  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex flex-col gap-4 bg-white pb-3 ${
        width ? width : "w-100"
      } ${isFormDisabled ? "opacity-50" : ""}`}
    >
      <textarea
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit!(e as unknown as React.FormEvent<HTMLFormElement>);
          }
        }}
        value={input}
        onChange={(e) => setInput!(e.target.value)}
        placeholder="Введите сообщение для ИИ..."
        className="py-3 px-5 bg-white border border-gray-300 rounded-3xl resize-none focus:outline-none"
        rows={2}
        disabled={isFormDisabled}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-2 py-2 rounded-full hover:bg-gray-900 cursor-pointer disabled:opacity-50 
        absolute bottom-5 right-3"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {loading ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <Forward size={18} />
        )}
      </button>
    </form>
  );
};

export default SendToAIForm;

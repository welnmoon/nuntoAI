import { LoaderCircle } from "lucide-react";

const SecondaryButton = ({
  text,
  type,
  loading,
}: {
  text: string;
  type: "submit" | "button";
  loading?: boolean;
}) => {
  return (
    <button
      type={type}
      className="bg-gray-900 flex items-center justify-center rounded-md text-white px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
    >
      {loading ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <span className="">{text}</span>
      )}
    </button>
  );
};

export default SecondaryButton;

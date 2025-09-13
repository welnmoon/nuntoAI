import { ArrowRightCircle } from "lucide-react";

const MainBtn = ({ text }: { text: string }) => {
  return (
    <button
      className="flex gap-2 items-center
    bg-cyan-600 px-4 py-2 rounded-xl text-white
    hover:bg-blue-400 transition-colors duration-200 cursor-pointer"
    >
      {text}
      <ArrowRightCircle size={20} />
    </button>
  );
};

export default MainBtn;

const SecondaryButton = ({
  text,
  type,
}: {
  text: string;
  type: "submit" | "button";
}) => {
  return (
    <button
      type={type}
      className="bg-gray-900 rounded-md text-white px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
    >
      {text}
    </button>
  );
};

export default SecondaryButton;

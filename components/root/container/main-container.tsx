const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-[1280px] md:max-w-[1024px] mx-auto px-4">
      {children}
    </div>
  );
};

export default MainContainer;

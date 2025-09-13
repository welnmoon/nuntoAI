import LogotypeNunto from "@/components/logotype-nunto";
import HeaderNav from "./header-nav";
import MainContainer from "../container/main-container";
import HeaderLogInBtn from "../buttons/header-log-in-btn";

const Header = () => {
  return (
    <header className="sticky top-7 z-40 mb-20">
      <MainContainer>
        {/*header*/}
        <div className="mx-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md supports-[backdrop-filter]:bg-white/5">
          <div className="flex items-center justify-between px-4 py-2">
            <LogotypeNunto textStyle="text-white" />
            <HeaderNav />
            <HeaderLogInBtn />
          </div>
        </div>
      </MainContainer>
    </header>
  );
};

export default Header;

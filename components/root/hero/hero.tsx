import Link from "next/link";
import DocumentationBtn from "../buttons/doc-btn";
import MainBtn from "../buttons/main-btn";
import MainContainer from "../container/main-container";
import HeroLeftSide from "./hero-left-side";
import HeroRightSide from "./hero-right-side";
import { CLIENT_ROUTES } from "@/lib/client-routes";

const Hero = () => {
  return (
    <>
      <MainContainer>
        <div className="p-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <HeroLeftSide />
            <HeroRightSide />
          </div>
          <div className="mt-6 mb-6 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link prefetch={false} target="_blank" href={CLIENT_ROUTES.home}>
              <MainBtn text="Попробовать" />
            </Link>
            <DocumentationBtn />
          </div>
          <p className="text-gray-400 text-sm md:text-left text-center">
            Бесплатно · Без карты · 14‑дневный пробный период
          </p>
        </div>
      </MainContainer>
      <div className="h-[1px] w-[calc(100%-32px)] mx-auto bg-gray-500 rounded-full mt-10"></div>
    </>
  );
};

export default Hero;

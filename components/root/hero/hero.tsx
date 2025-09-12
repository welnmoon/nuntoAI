import DocumentationBtn from "../buttons/doc-btn";
import MainBtn from "../buttons/main-btn";
import MainContainer from "../container/main-container";
import HeroLeftSide from "./hero-left-side";
import HeroRightSide from "./hero-right-side";

const Hero = () => {
  return (
    <MainContainer>
      <div className="p-4">
        <div className="mb-8 lg:flex text-center lg:text-left flex-col md:flex-row items-items-start md:center gap-8">
          {/*Hero left side*/}
          <HeroLeftSide />
          {/*Hero right side*/}
          <HeroRightSide />
        </div>
        {/*Buttons*/}
        <div className="flex gap-6 items-center">
          <MainBtn text="Попробовать" />
          <DocumentationBtn />
        </div>
      </div>
    </MainContainer>
  );
};

export default Hero;

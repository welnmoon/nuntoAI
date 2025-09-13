import Header from "@/components/root/header/header";
import Hero from "@/components/root/hero/hero";
import TrustedBy from "@/components/root/trusted-by";

const RootPage = () => {
  return (
    <div
      className="min-h-screen p-0 m-0"
      style={{
        background: `
      radial-gradient(circle at 20% 30%, rgba(0,123,255,0.4), transparent 50%),
      radial-gradient(circle at 80% 40%, rgba(0,200,255,0.3), transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(100,180,255,0.35), transparent 50%),
      #0f1226
    `,
      }}
    >
      <Header />
      {/*hero*/}
      <Hero />
      <TrustedBy />
    </div>
  );
};

export default RootPage;

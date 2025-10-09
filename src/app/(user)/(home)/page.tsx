import Navigation from "@/components/Navigation";
import ContentWrapper from "@/components/ContentWrapper";
import Footerapp from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navigation />

      <ContentWrapper>
        <h1>Home Page</h1>
      </ContentWrapper>

      {/* <Footerapp /> */}
    </div>
  );
}
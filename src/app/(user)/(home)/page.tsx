import Image from "next/image";
import ContentWrapper from "@/components/ContentWrapper";

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <ContentWrapper>
        <Image
          src="/images/home-banner.jpg"
          alt="Home Banner"
          width={1400}
          height={800}
          style={{flex: '1', width: '100%', height: 'auto', borderRadius: 8}}
          priority
        />
      </ContentWrapper>
    </div>
  );
}

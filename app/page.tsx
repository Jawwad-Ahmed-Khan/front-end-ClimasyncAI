import Image from "next/image";
import Image_slider from "./_components/home_components/image_slider";
import Key_Milstone from "./_components/home_components/key_Milstone";
import Workflow from "./_components/home_components/workflow";
import WhyThisProject from "./_components/home_components/why_this_project";
import TestimonialsLogos from "./_components/home_components/testimonials";
import JoinUs from "./_components/home_components/join_us";

export default function Home() {
  return (
    <div>
      <Image_slider/>
      <Key_Milstone/>
      <Workflow/>
      <WhyThisProject/>
      <TestimonialsLogos/>
      <JoinUs/>
    </div>
  );
}

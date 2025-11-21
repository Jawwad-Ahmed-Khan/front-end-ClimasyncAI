import Image from "next/image";
import Image_slider from "./_components/home_components/image_slider";
import Key_Milstone from "./_components/home_components/key_Milstone";
import Workflow from "./_components/home_components/workflow";
export default function Home() {
  return (
    <div>
      <Image_slider/>
      <Key_Milstone/>
      <Workflow/>
    </div>
  );
}

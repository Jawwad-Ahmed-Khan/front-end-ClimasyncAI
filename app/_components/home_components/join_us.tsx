import Image from "next/image";
import Link from "next/link";
import { DIV_Styles, Text_Styles } from "@/app/_types/const_types";
const JoinUs = () => {
    return (
        <div className={DIV_Styles.Container + " relative bg-[#0B1120]"}>

            <Image src="/images/home/join_back.webp" alt="join_back" fill className="object-cover object-top scale-x-[-1]" />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent z-0" />

            <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 w-full h-full">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className={Text_Styles.Heading_1 + " text-white mb-8! md:mb-12!"}>
                        Join us in building disaster resilience
                        for Pakistan and beyond.
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-x-8 w-full sm:w-auto">
                    <Link href="/register" className="bg-blue-600 w-full sm:w-[200px] h-[50px] rounded-xl text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center">Register NGO</Link>
                    <Link href="/about" className="bg-gray-100 w-full sm:w-[200px] h-[50px] rounded-xl text-blue-600 font-semibold hover:bg-white transition-colors cursor-pointer flex items-center justify-center">Learn More</Link>
                </div>
            </div>
        </div>
    );
};

export default JoinUs;

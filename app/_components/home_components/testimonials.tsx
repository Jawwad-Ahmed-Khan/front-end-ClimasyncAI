'use client'
import React from "react";
import Image from "next/image";

// --- Style Constants ---
const Styles = {
  Section: "w-full py-16 md:py-24 bg-gray-950 text-white overflow-hidden mb-16 md:mb-20",
  Container: "max-w-7xl mx-auto px-4",
  Heading: "text-3xl md:text-5xl font-bold text-center mb-12 tracking-tight",
  // Circular white wrapper for logos
  LogoWrapper: "relative flex items-center justify-center h-24 w-24 md:h-32 md:w-32 bg-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300",
};

// --- Dummy Data for Logos (Pure Images Only) ---
const PARTNERS = [
  { id: 1, name: "Blue Crest", logo: "/images/logos/pakistan.png" },
  { id: 2, name: "Red Crest", logo: "/images/logos/sindh.png" },
  { id: 3, name: "NDMA", logo: "/images/logos/ndma.png" },
  { id: 4, name: "NGO", logo: "/images/logos/pdma.jpg" },
];

export default function TestimonialsLogos() {
  // Duplicate the partners list to create a seamless loop
  const extendedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className={Styles.Section}>
      <div className={Styles.Container}>
        <h2 className={Styles.Heading}>Testimonials</h2>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden mask-image-gradient">
          {/* 
              We need two sets of the content for the seamless loop effect.
              The animation moves the whole strip by 50% of its width.
           */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {/* First Set */}
            <div className="flex items-center gap-8 md:gap-16 px-4 md:px-8">
              {extendedPartners.map((partner, index) => (
                <div key={`original-${index}`} className={Styles.LogoWrapper}>
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-5"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              ))}
            </div>

            {/* Second Set (Duplicate for seamless loop) */}
            <div className="flex items-center gap-8 md:gap-16 px-4 md:px-8">
              {extendedPartners.map((partner, index) => (
                <div key={`duplicate-${index}`} className={Styles.LogoWrapper}>
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-5"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
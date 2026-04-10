'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'

export function ImageSlider() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })] // Increased delay for better UX
  )

  const images = [
    '/images/home/slide1.webp',
    '/images/home/slide2.webp',
    '/images/home/slide3.webp',
  ]

  const Handle_Register_NGo = () => {
    console.log("Register NGO button clicked");
  }


  return (
    // 1. MAIN CONTAINER: Acts as the "Frame" (relative)
    <div className="relative w-full h-[85vh] overflow-hidden">

      {/* 2. BACKGROUND LAYER: The Slider */}
      {/* We stick to h-full here so it fills the parent */}
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, index) => (
            <div key={index} className="relative shrink-0 w-full h-full">
              <Image
                src={src}
                alt={`Disaster management scene ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0} // Load first image faster
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. FOREGROUND LAYER: The Text Overlay */}
      {/* absolute inset-0 makes this float over the slider and fill the space */}
      {/* bg-black/50 adds the dark tint so text is readable */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 text-center px-4">

        {/* Typography matched to your target image */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl drop-shadow-gray-900">
          AI-Powered Disaster <br />
          Management for Pakistan
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-8 font-medium drop-shadow-md">
          Verify. Analyze. Respond. Save Lives.
        </p>

        {/* Buttons Section */}
        <div className="flex gap-4">
          <Link href="/map" className="bg-blue-600 hover:bg-blue-700 hover:scale-110 text-white font-semibold py-3 px-8 rounded-full transition duration-300 cursor-pointer">
            View Live Map
          </Link>
          <Link href="/register" className=" bg-white text-blue-900 font-semibold py-3 px-8 rounded-full transition duration-300 hover:bg-gray-100 hover:scale-110 cursor-pointer">
            Register NGO
          </Link>
        </div>

      </div>
      <div className="absolute inset-x-0 bottom-0 w-full h-[15%] bg-linear-to-t from-black/60 to-transparent" />
    </div>
  )
}

export default ImageSlider
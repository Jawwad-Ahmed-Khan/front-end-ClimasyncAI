'use client';

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { XCircle, CheckCircle2, ChevronUp, ChevronDown, ArrowRight } from "lucide-react";
import { EmblaCarouselType } from 'embla-carousel';

// --- Local Style Constants (Replacing external import for self-containment) ---
const DIV_Styles = {
  Container: "w-full py-16 relative",
  Section_Bottom_Only: "pb-24 pt-0",
};

const Layout = {
  maxWidth: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
};

const Text_Styles = {
  Heading_1: "text-3xl md:text-4xl font-bold text-slate-900 text-center",
  paragraph: "text-base leading-relaxed",
};

// --- Types & Interfaces ---

interface Problem {
  title: string;
  desc: string;
}

interface Solution {
  title: string;
  desc: string;
}

interface ProjectItem {
  id: number;
  image: string;
  problem: Problem;
  solution: Solution;
}

// --- Data Configuration ---

const PROJECT_DATA: ProjectItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", 
    problem: {
      title: "Unverified & Scattered Information",
      desc: "Traditional systems rely on slow, manual checks and disconnected sources, causing false alarms and delayed action.",
    },
    solution: {
      title: "Agentic Verification",
      desc: "Our Verification Agent cross-checks sensor, API, and human data with trusted models to ensure only accurate, reliable disaster information is processed.",
    },
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1603787081207-362bcef7c144?q=80&w=2065&auto=format&fit=crop",
    problem: {
      title: "Slow & Fragmented Response Planning",
      desc: "Pakistan lacks an automated system for quick risk assessment and coordinated action.",
    },
    solution: {
      title: "Automated Risk & Precaution",
      desc: "The Risk Analysis Agent scores hazards using local data, while the Precaution Definer Agent instantly generates clear safety steps when danger rises.",
    },
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    problem: {
      title: "Duplicated Relief Efforts & Wastage",
      desc: "NGOs often repeat tasks due to poor coordination and lack of AI-driven planning.",
    },
    solution: {
      title: "Intelligent Resource Allocation",
      desc: "The Task Allocator Agent assigns responsibilities based on area needs and NGO capacity, reducing overlap and maximizing impact.",
    },
  },
];

export default function WhyThisProject() {
  // --- Embla Configuration ---
  // axis: 'x' is default (Mobile Horizontal)
  // breakpoint 768px switches to axis: 'y' (Desktop Vertical)
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    axis: 'x', 
    loop: true,
    duration: 40,
    breakpoints: {
      '(min-width: 768px)': { axis: 'y' }
    }
  }, [Autoplay({ delay: 5000 })]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(true);

  // --- Handlers ---

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // --- Render ---

  return (
    <section className={`${DIV_Styles.Container} ${DIV_Styles.Section_Bottom_Only} bg-slate-50`}>
      <div className={Layout.maxWidth}>
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            ClimaSync.AI Core
          </span>
          <h2 className={Text_Styles.Heading_1}>Why This Project?</h2>
        </div>

        {/* Carousel Container */}
        {/* Mobile: 650px height allows enough space for vertical stacked content within a horizontal slide */}
        {/* Desktop: 600px fixed height for the vertical carousel */}
        <div className="relative w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden h-[650px] md:h-[600px]">
          
          {/* Embla Viewport */}
          <div className="overflow-hidden h-full" ref={emblaRef}>
            
            {/* Flex Container Logic:
              - Mobile: 'flex-row' ensures slides sit side-by-side for horizontal scrolling.
              - Desktop (md): 'flex-col' ensures slides stack for vertical scrolling.
              - Touch Action: 'touch-pan-y' on mobile prevents page scroll locking while swiping horizontal. 
            */}
            <div className="flex flex-row md:flex-col h-full touch-pan-y md:touch-pan-x">
              
              {PROJECT_DATA.map((item, index) => (
                <div key={item.id} className="flex-[0_0_100%] h-full min-w-0 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    
                    {/* LEFT HALF: IMAGE */}
                    <div className="relative h-64 md:h-full w-full overflow-hidden bg-slate-200">
                      
                      {/* ------------------------------------------------------------
                         REPLACE THE <img> BELOW WITH THIS NEXT.JS <Image /> COMPONENT:
                         ------------------------------------------------------------
                         <Image 
                           src={item.image} 
                           alt={item.solution.title}
                           fill
                           className="object-cover transition-transform duration-700 hover:scale-105"
                           sizes="(max-width: 768px) 100vw, 50vw"
                           priority={index === 0} 
                         />
                         ------------------------------------------------------------
                      */}
                      
                      <img
                        src={item.image}
                        alt={item.solution.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />

                      {/* Mobile Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden pointer-events-none" />
                      
                      {/* Slide Counter Badge */}
                      <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded-full border border-white/20 z-10">
                        {index + 1} / {PROJECT_DATA.length}
                      </div>
                    </div>

                    {/* RIGHT HALF: CONTENT */}
                    <div className="flex flex-col justify-center p-6 md:p-10 lg:p-16 space-y-4 md:space-y-6 bg-white h-full relative">
                      
                      {/* 1. PROBLEM BLOCK */}
                      <div className="group relative overflow-hidden rounded-xl bg-red-50 border border-red-100 p-4 md:p-6 transition-all hover:shadow-md hover:border-red-200">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-white rounded-full shadow-sm shrink-0">
                            <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-xs md:text-sm font-bold text-red-900 uppercase tracking-wide mb-1">
                              Current State
                            </h3>
                            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                              {item.problem.title}
                            </h4>
                            <p className={`${Text_Styles.paragraph} text-sm md:text-base text-slate-600`}>
                              {item.problem.desc}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Arrow Divider (Desktop) */}
                      <div className="hidden md:flex justify-center text-slate-300">
                          <ArrowRight className="w-6 h-6 rotate-90" />
                      </div>

                      {/* 2. SOLUTION BLOCK */}
                      <div className="group relative overflow-hidden rounded-xl bg-emerald-50 border border-emerald-100 p-4 md:p-6 transition-all hover:shadow-md hover:border-emerald-200">
                          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-white rounded-full shadow-sm shrink-0">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-xs md:text-sm font-bold text-emerald-900 uppercase tracking-wide mb-1">
                              Our Solution
                            </h3>
                            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                              {item.solution.title}
                            </h4>
                            <p className={`${Text_Styles.paragraph} text-sm md:text-base text-slate-600`}>
                              {item.solution.desc}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
              
            </div>
          </div>

          {/* --- CONTROLS (Desktop / Vertical) --- */}
          <div className="hidden md:flex flex-col absolute right-6 top-1/2 -translate-y-1/2 gap-4 z-10">
            
            {/* Up Button */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev && !emblaApi?.internalEngine().options.loop}
              className="p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-emerald-600 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {/* Indicators */}
            <div className="flex flex-col gap-2 items-center py-2 bg-white/80 backdrop-blur-sm rounded-full px-1 shadow-sm border border-slate-100">
              {PROJECT_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`w-2 rounded-full transition-all duration-500 ${
                    idx === selectedIndex 
                      ? "h-8 bg-emerald-500 shadow-md shadow-emerald-200" 
                      : "h-2 bg-slate-300 hover:bg-emerald-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Down Button */}
            <button
              onClick={scrollNext}
              disabled={!canScrollNext && !emblaApi?.internalEngine().options.loop}
              className="p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-emerald-600 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* --- CONTROLS (Mobile / Horizontal) --- */}
          <div className="flex md:hidden absolute bottom-4 left-0 right-0 justify-center gap-2 z-20 pointer-events-none">
             {PROJECT_DATA.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className={`h-2 rounded-full transition-all duration-300 shadow-sm pointer-events-auto ${
                        idx === selectedIndex ? "w-8 bg-emerald-500" : "w-2 bg-slate-300/80 hover:bg-emerald-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
import Image from "next/image";

const KeyMilestone = () => {
  const pitcures = [
    {
      src: '/images/home/report.png',
      alt: 'report',
      // We can remove width/height from here and control it via CSS classes for better responsiveness
      title: '200+',
      description: 'Reports Verified' // Slightly longer text to test wrapping
    },
    {
      src: '/images/home/ngo.png',
      alt: 'NGO',
      title: '50+',
      description: 'NGOs Registered'
    },
    {
      src: '/images/home/city.png',
      alt: 'City',
      title: '80+',
      description: 'Cities Reached'
    },
    {
      src: '/images/home/family.png',
      alt: 'Family',
      title: '1.2M',
      description: 'Families Assisted'
    },
    {
      src: '/images/home/money.png',
      alt: 'Money',
      title: 'USD 10M',
      description: 'Funds Optimized'
    }
  ]

  return (
    // 1. WRAPPER: Changed 'mt-5' to 'py-12 md:py-20'. 
    // This gives proper vertical breathing room on all devices.
    <div className="w-full bg-white py-12 md:py-24 px-4">
      
      <div className="max-w-7xl mx-auto">
        {/* 2. HEADING: text-3xl for mobile, text-4xl/5xl for desktop */}
        <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-12 md:mb-20">
          Key Milestones
        </h1>

        {/* 3. GRID LAYOUT:
            - grid-cols-2: Mobile (2 per row)
            - md:grid-cols-3: Tablets (3 per row)
            - lg:grid-cols-5: Laptops (All in one row)
            - gap-y-12: Vertical space between rows
        */}
        <div className="
          grid 
          grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-5 
          gap-x-6 
          gap-y-12 
          justify-items-center
        ">
          {pitcures.map((pic, index) => (
            <div 
              className="flex flex-col items-center text-center group" 
              key={index}
            >
              {/* 4. IMAGE CONTAINER:
                  - Fixed height wrapper prevents layout shifts.
                  - transform transition: Adds a subtle pop when hovering over the icon.
              */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6 transition-transform duration-300 group-hover:scale-110">
                <Image 
                  src={pic.src} 
                  alt={pic.alt} 
                  fill
                  className="object-contain"
                />
              </div>

              {/* 5. TYPOGRAPHY: 
                  - Title: Smaller on mobile, bolder.
                  - Desc: Gray color for hierarchy.
              */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-2">
                {pic.title}
              </h2>
              <p className="text-sm md:text-base font-medium text-gray-600 max-w-[120px] md:max-w-none leading-tight">
                {pic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KeyMilestone;
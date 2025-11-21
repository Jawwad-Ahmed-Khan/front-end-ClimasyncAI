import React from 'react';
import { DIV_Styles, Layout, Text_Styles } from '@/app/_types/const_types';
// --- Simulating your Imported Constants ---


// --- Component ---

const Workflow = () => {
  const steps = [
    { id: 1, title: 'Verification', desc: 'Validate disaster reports & data sources.' },
    { id: 2, title: 'Risk Analysis', desc: 'AI-driven assessment of disaster severity & impact.' },
    { id: 3, title: 'Precaution', desc: 'Proactive planning & resource allocation for safety.' },
    { id: 4, title: 'Work Dist.', desc: 'Efficient assignment of tasks to response teams.' },
    { id: 5, title: 'NGO & Alerts', desc: 'Seamless coordination with NGOs & public alerts.' },
  ];

  return (
    <>
      {/* Custom Animation Styles */}
      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-move 3s ease infinite;
        }
      `}</style>

      <div className={`${DIV_Styles.Container} ${DIV_Styles.Section_Bottom_Only} pt-12`}>
        <div className={Layout.maxWidth}>
          <h1 className={Text_Styles.Heading_1}>
            Our Workflow
          </h1>

          <div className={Layout.Grid}>
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative w-full max-w-[280px] min-h-56 md:min-h-60 
                           border-2 border-gray-200 rounded-2xl flex flex-col items-center 
                           pt-10 pb-6 bg-white transition-shadow duration-300 hover:shadow-lg hover:border-gray-300"
              >
                {/* Number Badge with Moving Gradient */}
                {/* Updated: 
                    1. Added 'via-blue-500 to-purple-600' for better color flow 
                    2. Added 'animate-gradient' class defined in style tag above
                */}
                <div className="absolute -top-7 rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl text-gray-800 shadow-sm bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">
                  <h2 className='bg-white w-12 h-12 flex items-center justify-center rounded-full'>
                    {index + 1}
                  </h2>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center grow px-3 text-center space-y-3 mt-2">
                  <h2 className={`${Text_Styles.Heading_2} text-xl! md:text-2xl! leading-tight text-gray-800`}>
                    {step.title}
                  </h2>
                  <p className="text-sm md:text-base font-medium text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Workflow;
import React from 'react';
import { Smartphone, Zap, UserPlus, BarChart3 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Zap size={24} className="text-blue-600" />,
      title: "Tap Card",
      description: "Tap your physical card to any modern smartphone. No app required."
    },
    {
      icon: <Smartphone size={24} className="text-blue-600" />,
      title: "Open Profile",
      description: "Your digital profile opens instantly in their native browser."
    },
    {
      icon: <UserPlus size={24} className="text-blue-600" />,
      title: "Save Contact",
      description: "They tap 'Save Contact' and your details go straight into their phonebook."
    },
    {
      icon: <BarChart3 size={24} className="text-blue-600" />,
      title: "Track Engagement",
      description: "View connection analytics and lead captures in your TapFolio dashboard."
    }
  ];

  return (
    <section id="technology" className="w-full py-32 bg-gray-50 flex flex-col items-center">
      <div className="max-w-[1000px] w-full px-6">
        
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-950 mb-6 tracking-tight">
            Seamless Networking.
          </h2>
          <p className="text-gray-500 text-lg max-w-[500px] mx-auto">
            From physical touch to digital connection in under 2 seconds.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line Connector for Desktop */}
          <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-100px)] bg-gray-200" />
          
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div key={idx} className={`flex flex-col md:flex-row items-center justify-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />

                {/* Center Icon Node */}
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg shadow-gray-200/50 relative z-10 shrink-0">
                  {step.icon}
                </div>

                {/* Content Box */}
                <div className={`flex-1 text-center md:text-left ${idx % 2 === 0 ? 'md:text-right' : ''}`}>
                  <h3 className="font-display font-bold text-2xl text-gray-950 mb-2">{step.title}</h3>
                  <p className="text-gray-500 max-w-[300px] mx-auto md:mx-0 inline-block">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

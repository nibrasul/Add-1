import React from 'react';

export default function MetricsStrip() {
  const metrics = [
    { value: "10,000+", label: "Profile Views" },
    { value: "2,500+", label: "Connections Shared" },
    { value: "500+", label: "Cards Delivered" },
    { value: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <section className="w-full bg-gray-50 border-b border-gray-200 py-16">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200/50">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center text-center px-4">
            <div className="font-display font-black text-4xl md:text-5xl text-blue-600 mb-2">
              {metric.value}
            </div>
            <div className="text-sm font-bold tracking-wider text-gray-500 uppercase">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

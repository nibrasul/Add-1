import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ProductsSection() {
  const products = [
    {
      name: "PVC",
      tier: "Entry",
      description: "Matte-finished recycled polymer.",
      price: "$39",
      bg: "bg-gray-50",
      textColor: "text-gray-900"
    },
    {
      name: "Metal",
      tier: "Premium",
      description: "Brushed military-grade steel.",
      price: "$89",
      bg: "bg-[#0a0a0a]",
      textColor: "text-white"
    },
    {
      name: "Team",
      tier: "Business",
      description: "Unified corporate branding.",
      price: "$299/mo",
      bg: "bg-blue-600",
      textColor: "text-white"
    },
    {
      name: "Custom",
      tier: "Enterprise",
      description: "Direct API & laser etching.",
      price: "Custom",
      bg: "bg-gray-100",
      textColor: "text-gray-900"
    }
  ];

  return (
    <section id="products" className="w-full py-32 bg-white flex flex-col items-center">
      <div className="max-w-[1200px] w-full px-6">
        
        <div className="mb-20 text-center">
          <h2 id="pricing" className="font-display font-bold text-4xl md:text-5xl text-gray-950 mb-6 tracking-tight">
            Hardware Built for Professionals.
          </h2>
          <p className="text-gray-500 text-lg max-w-[600px] mx-auto">
            Choose the physical medium that represents your brand. All cards include lifetime access to the TapFolio software ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod, idx) => (
            <div 
              key={idx} 
              className={`group rounded-3xl p-8 flex flex-col justify-between h-[420px] transition-transform hover:-translate-y-2 ${prod.bg} ${prod.textColor}`}
            >
              <div>
                <span className={`text-xs font-bold tracking-widest uppercase mb-2 block opacity-70`}>
                  {prod.tier}
                </span>
                <h3 className="font-display font-bold text-3xl mb-3">{prod.name}</h3>
                <p className="opacity-80 text-sm leading-relaxed max-w-[200px]">
                  {prod.description}
                </p>
              </div>

              {/* Placeholder for Product Image/3D Render */}
              <div className="flex-1 w-full my-6 relative overflow-hidden rounded-xl border border-white/10 bg-black/5 flex items-center justify-center">
                 <div className="w-24 h-16 rounded shadow-lg bg-current opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">{prod.price}</span>
                <button className="w-8 h-8 rounded-full bg-current opacity-20 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ArrowRight size={14} className={prod.textColor === "text-white" ? "text-black" : "text-white"} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

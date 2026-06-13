import React from 'react';

export default function TrustCompanySection() {
  return (
    <section id="industries" className="w-full py-32 bg-gray-50 border-t border-b border-gray-100 flex justify-center">
      <div className="max-w-[1200px] w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left: Mission & Leadership */}
        <div>
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-4 block">
            Trust & Company
          </span>
          <h2 className="font-display font-bold text-4xl text-gray-950 mb-6">
            The Team Behind the Tap.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-12">
            Our mission is to eliminate the archaic paper business card and replace it with a dynamic, eco-friendly, and highly measurable digital connection.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="Founder" className="w-16 h-16 rounded-full grayscale" />
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Alex Sterling</h4>
                <span className="text-blue-600 text-sm font-medium">Founder & CEO</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" alt="Co-Founder" className="w-16 h-16 rounded-full grayscale" />
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Sarah Jenkins</h4>
                <span className="text-blue-600 text-sm font-medium">Co-Founder & Head of Product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customer Success */}
        <div className="flex flex-col gap-6">
          <h3 className="font-display font-bold text-2xl text-gray-950 mb-2">Customer Success</h3>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-colors">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-600 transform translate-x-full group-hover:translate-x-0 transition-transform" />
            <div className="mb-4">
              <span className="text-4xl font-black text-gray-900">120+</span>
              <span className="block text-sm font-bold text-blue-600 tracking-wider uppercase mt-1">Qualified Leads</span>
            </div>
            <p className="text-gray-600 text-base leading-relaxed italic mb-4">
              "We deployed TapFolio Metal to our entire enterprise sales floor. Within 3 months, our CRM captured 120+ highly qualified leads directly from the NFC tap integration."
            </p>
            <span className="text-xs font-bold text-gray-400 uppercase">David Chen — VP of Sales, CloudSys</span>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-colors">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-600 transform translate-x-full group-hover:translate-x-0 transition-transform" />
            <div className="mb-4">
              <span className="text-4xl font-black text-gray-900">$0</span>
              <span className="block text-sm font-bold text-blue-600 tracking-wider uppercase mt-1">Printing Costs</span>
            </div>
            <p className="text-gray-600 text-base leading-relaxed italic mb-4">
              "Our agency used to spend thousands annually reprinting paper cards every time someone's title changed. Now, we update it globally in the TapFolio dashboard in 2 seconds."
            </p>
            <span className="text-xs font-bold text-gray-400 uppercase">Elena Rodriguez — Principal, ArchStudio</span>
          </div>

        </div>

      </div>
    </section>
  );
}

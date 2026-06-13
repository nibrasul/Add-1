import React from 'react';
import { ShieldCheck, Lock, Database, Server } from 'lucide-react';

export default function SecuritySection() {
  const features = [
    {
      icon: <Lock size={20} className="text-gray-900" />,
      title: "Secure NFC Technology",
      description: "Read-only microchips that cannot be wirelessly rewritten or hijacked by third parties."
    },
    {
      icon: <ShieldCheck size={20} className="text-gray-900" />,
      title: "GDPR Ready",
      description: "Full compliance with European data protection regulations. Users control their visibility."
    },
    {
      icon: <Database size={20} className="text-gray-900" />,
      title: "Data Ownership",
      description: "You own your connections. Export your entire networking history at any time."
    },
    {
      icon: <Server size={20} className="text-gray-900" />,
      title: "Enterprise Infrastructure",
      description: "Hosted on SOC2 compliant servers with 99.99% guaranteed uptime for your profile."
    }
  ];

  return (
    <section className="w-full py-24 bg-gray-50 border-t border-b border-gray-100 flex justify-center">
      <div className="max-w-[1200px] w-full px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
        
        <div className="lg:col-span-1">
          <ShieldCheck size={48} className="text-blue-600 mb-6" />
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-950 mb-4 tracking-tight">
            Built with Privacy In Mind.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            When you tap your card, you are securely routing data through enterprise-grade infrastructure. We protect your professional identity with military-grade encryption.
          </p>
          <a href="#" className="text-blue-600 font-bold hover:underline">Read our Security Policy →</a>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 mb-4">
                {feature.icon}
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

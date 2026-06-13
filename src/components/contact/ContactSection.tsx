import React from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="chapter7" className="w-full bg-[#0a0a0a] text-white relative z-10 pt-32 pb-12">
      <div className="max-w-[1200px] w-full px-6 md:px-12 mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          
          {/* Left Column: Contact Info */}
          <div>
            <span className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-4 block">
              Chapter 07 — Connect
            </span>
            <h2 className="font-display font-bold text-5xl md:text-6xl mb-8 leading-tight">
              Let's Build Your <br/> Digital Future.
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-[480px]">
              Whether you need a single premium metal card or a full corporate fleet integration, our team is ready to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Email Us</h4>
                  <a href="mailto:hello@tapfolio.me" className="text-gray-400 hover:text-white transition-colors">hello@tapfolio.me</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Call Us</h4>
                  <a href="tel:+18005550199" className="text-gray-400 hover:text-white transition-colors">+1 (800) 555-0199</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Headquarters</h4>
                  <p className="text-gray-400">100 Innovation Drive<br/>San Francisco, CA 94103</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 backdrop-blur-md">
            <h3 className="font-display font-bold text-3xl mb-8">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                Send Inquiry <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.05] pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-bold text-2xl tracking-tighter">
            TapFolio.
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 TapFolio Inc. All rights reserved.
          </div>
        </div>

      </div>
    </section>
  );
}

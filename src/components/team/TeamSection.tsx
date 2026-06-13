import React from 'react';

const teamMembers = [
  {
    role: "Founder & CEO",
    name: "Alex Sterling",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    bio: "Visionary behind the TapFolio ecosystem. 10+ years in NFC technology.",
  },
  {
    role: "Co-Founder & Head of Design",
    name: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    bio: "Award-winning designer shaping the physical and digital aesthetic.",
  },
  {
    role: "Lead Developer",
    name: "Marcus Brody",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    bio: "Architect of the Zero-Gravity 3D experience and frontend frameworks.",
  },
  {
    role: "Backend Engineering Team",
    name: "The Core Systems Group",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    bio: "Ensuring 99.99% uptime for digital profile routing and global CRM analytics.",
  }
];

export default function TeamSection() {
  return (
    <section id="chapter5" className="w-full min-h-screen bg-gray-50 py-32 flex flex-col items-center justify-center relative z-10">
      <div className="max-w-[1200px] w-full px-6 md:px-12 mx-auto">
        
        <div className="mb-20 text-center">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-4 block">
            Chapter 05 — The Visionaries
          </span>
          <h2 className="font-display font-bold text-gray-950 text-5xl mb-6">
            Meet the Team
          </h2>
          <p className="text-gray-500 text-lg max-w-[600px] mx-auto">
            The engineers, designers, and innovators building the future of physical-to-digital networking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-200 relative">
                {/* Fallback image if unsplash fails, but using high quality unsplash */}
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-1 block">
                    {member.role}
                  </span>
                  <h3 className="text-white font-bold text-2xl mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

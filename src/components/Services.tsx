import React from "react";
import { Service } from "../types";
import * as Icons from "lucide-react";
import { motion } from "motion/react";

interface ServicesProps {
  services?: Service[];
}

export default function Services({ services = [] }: ServicesProps) {
  const getIcon = (name: string) => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) {
      return <IconComponent className="w-6 h-6 text-brand-primary" />;
    }
    return <Icons.HelpCircle className="w-6 h-6 text-brand-primary" />;
  };

  const outcomes = [
    {
      title: "Sifat va E'tibor",
      desc: "Har bir ishga puxta yondashaman va natija sifatiga alohida e'tibor qarataman."
    },
    {
      title: "Vaqtida Bajarish",
      desc: "Kelishilgan muddatlarga qat'iy amal qilib, ishni belgilangan vaqtda topshiraman."
    },
    {
      title: "Ochiq Muloqot",
      desc: "Jarayonning har bosqichida shaffof hamkorlik."
    }
  ];

  return (
    <section id="services" className="w-full">
      <div className='p-6 md:p-8'>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2">
            <Icons.Briefcase className="w-3.5 h-3.5" />
            XIZMATLAR
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-text">
            Professional Xizmatlar
          </h2>
        </div>
      </div>

      {/* Services Bento Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {services.length > 0 ? (
          services.map((service, idx) => {
            const isWide = idx === 0; // make the first service span 2 cols on tablet

            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className={`bg-brand-bg rounded-2xl border border-brand-border p-5 hover:shadow-md transition-all ${isWide ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center mb-4 shadow-sm">
                  {getIcon(service.iconName)}
                </div>
                <h3 className="text-lg font-bold text-brand-text mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-brand-muted italic py-4">Xizmatlar ma'lumotlari mavjud emas.</p>
        )}
      </div>

      {/* Outcomes Segment - Bottom span */}
      <div className="bg-brand-primary text-white rounded-2xl p-6 relative overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <h3 className="text-lg font-bold mb-4 relative z-10">Hamkorlik Natijalari</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          {outcomes.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Icons.Check className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white/90">{item.title}</h4>
                <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

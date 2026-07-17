import React, { useState } from "react";
import { submitMessage } from "../lib/api";
import { motion } from "motion/react";
import { Send, Mail, Phone, ExternalLink, Check, AlertCircle } from "lucide-react";
import { Profile } from "../types";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      setStatus({
        type: "error",
        message: "Ism va xabar maydonlari to'ldirilishi shart.",
      });
      return;
    }

    setStatus({ type: "loading", message: "Yuborilmoqda..." });

    try {
      await submitMessage(formData);
      setStatus({
        type: "success",
        message: "Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanaman.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Xabar yuborishda xatolik yuz berdi. Iltimos keyinroq qayta urunib ko'ring.",
      });
    }
  };

  return (
    <section id="contact" className="w-full">
      <div className='p-6 md:p-8'>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" />
            MEN BILAN BOG'LANISH
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-text">
            Hamkorlik Qilamizmi?
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Quick Contact Info Block - Bento style */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-brand-bg border border-brand-border p-6 rounded-2xl">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-brand-text">
              Ish takliflari va hamkorlik uchun
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Loyihalaringiz bo'yicha maslahat olish yoki hamkorlikni boshlash uchun istalgan aloqa turidan foydalanib xabar yo'llashingiz mumkin.
            </p>
          </div>

          <div className="space-y-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-brand-border hover:border-brand-primary/50 transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Email Manzil</p>
                  <p className="text-sm font-bold text-brand-text group-hover:text-brand-primary transition-colors break-all">
                    {profile.email}
                  </p>
                </div>
              </a>
            )}

            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-brand-border hover:border-brand-primary/50 transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Telefon raqam</p>
                  <p className="text-sm font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                    {profile.phone}
                  </p>
                </div>
              </a>
            )}

            {profile.telegram && (
              <a
                href={profile.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-brand-border hover:border-brand-primary/50 transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Telegram Aloqa</p>
                  <p className="text-sm font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                    @{profile.telegram.split("/").pop() || "telegram"}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Interactive Form Block */}
        <div className="lg:col-span-7 bg-brand-bg border border-brand-border p-6 rounded-2xl flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[10px] text-brand-muted uppercase tracking-wider font-bold">Ismingiz *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masalan: Davron"
                  className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-text transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] text-brand-muted uppercase tracking-wider font-bold">Email manzilingiz</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="davron@example.com"
                  className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-text transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-[10px] text-brand-muted uppercase tracking-wider font-bold">Telefon raqamingiz</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998 99 123 45 67"
                className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-text transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-[10px] text-brand-muted uppercase tracking-wider font-bold">Xabaringiz / Loyiha haqida *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Xabaringiz tafsilotlarini yozing..."
                className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-text transition-all resize-none"
              />
            </div>

            {status.type !== "idle" && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border font-bold ${
                  status.type === "loading"
                    ? "bg-white border-brand-border text-brand-muted"
                    : status.type === "success"
                    ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {status.type === "success" ? (
                  <Check className="w-4 h-4 text-brand-primary" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-light disabled:opacity-50 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                {status.type === "loading" ? "Yuborilmoqda..." : "Xabarni yuborish"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </section>
  );
}

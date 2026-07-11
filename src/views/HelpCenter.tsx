import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Book, 
  Terminal, 
  ShieldQuestion, 
  ChevronDown, 
  ExternalLink,
  Github,
  Twitter,
  Mail
} from 'lucide-react';

export function HelpCenter() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "Shahrim uchun XP'ni qanday to'playman?",
      a: "Topshiriqlar bo'limida vazifani bajarganingizda yoki Masalalar to'plamida biror masalani yechganingizda, siz Universal XP olasiz. Bu XP bevosita shahringiz rivojlanishini ta'minlaydi va yangi bino turlarini ochadi."
    },
    {
      q: "Arena mavsumlari nima?",
      a: "Mavsumlar 30 kun davom etadi. Shu davrda har bir jangdagi g'alaba reytingingizga qo'shiladi. Mavsum yakunida Top 100'ga kirgan o'yinchilar noyob jihozlar va kamyob shahar yodgorliklarini qo'lga kiritadi."
    },
    {
      q: "O'qituvchi maqomiga qanday erishaman?",
      a: "O'qituvchi maqomi 50+ darajadagi profilni saqlab kelayotgan va \"Asosiy Pedagogik Baholash\"dan o'tgan jamoa a'zolariga beriladi. Ushbu talablarga javob bersangiz, yordam xizmatiga murojaat qiling."
    },
    {
      q: "Code Lab'da tashqi kutubxonalardan foydalansam bo'ladimi?",
      a: "Ha! Code Lab ko'pgina mashhur NPM paketlarini qo'llab-quvvatlaydi. Sandboxingizga bog'liqliklar qo'shish uchun laboratoriya ichidagi paket menejeri interfeysidan foydalaning."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-brand-cyan/10 rounded-3xl border border-brand-cyan/20 mb-6">
          <HelpCircle size={48} className="text-brand-cyan" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-white tracking-tight mb-4">Neyro-yordam interfeysi</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">Har qanday texnik muammo yuzasidan markaziy bilimlar bazasidan foydalaning yoki yordam xizmati xodimlari bilan bog'laning.</p>

        <div className="mt-8 relative max-w-2xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Hujjatlar, darsliklar va jamoa yechimlarini qidirish..."
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-brand-cyan focus:outline-none transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Hujjatlar', icon: <Book className="text-brand-cyan" />, desc: 'Platforma bo\'yicha asosiy qo\'llanmalar' },
          { label: 'Jamoa', icon: <MessageSquare className="text-brand-purple" />, desc: 'Boshqa foydalanuvchilar bilan muhokama qiling' },
          { label: 'Terminal jurnali', icon: <Terminal className="text-brand-orange" />, desc: 'Tizim holati va yangilanishlar' },
        ].map((box, i) => (
          <button key={i} className="glass-panel p-6 border border-white/10 rounded-2xl hover:border-brand-cyan/50 transition-all text-left group">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-fit mb-4 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/30 transition-all">
              {box.icon}
            </div>
            <h3 className="font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">{box.label}</h3>
            <p className="text-xs text-gray-500">{box.desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ShieldQuestion className="text-brand-purple" />
            Tez-tez so'raladigan savollar
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gray-500 transition-transform ${openFaq === i ? 'rotate-180 text-brand-cyan' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 text-sm text-gray-400 leading-relaxed"
                  >
                    <div className="pt-2 border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-purple/10 border border-brand-purple/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Hali ham muammoga duch kelyapsizmi?</h3>
            <p className="text-gray-400 text-sm">Yordam xizmati xodimlari shahringiz, jihozlaringiz yoki hisobingiz bilan bog'liq har qanday muammoni hal qilishda sizga 24/7 yordam berishga tayyor.</p>
          </div>
          <button className="px-8 py-3 bg-brand-purple hover:bg-brand-purple/80 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(176,38,255,0.4)] whitespace-nowrap">
            Yordam so'rovini ochish
          </button>
        </div>

        <div className="flex justify-center gap-8 py-8 border-t border-white/5">
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <Github size={18} /> GitHub
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <Twitter size={18} /> Twitter
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <Mail size={18} /> Elektron pochta
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <ExternalLink size={18} /> Hujjatlar
          </button>
        </div>
      </div>
    </div>
  );
}

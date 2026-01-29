import React, { useState } from 'react';
import { GUIDES } from '../data/badges';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';

const GuideSection: React.FC = () => {
  const [openGuide, setOpenGuide] = useState<string | null>(GUIDES[0].id);

  const toggleGuide = (id: string) => {
    setOpenGuide(openGuide === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {GUIDES.map((guide) => (
        <div 
          key={guide.id} 
          className={`
            border rounded-2xl overflow-hidden transition-all duration-300
            ${openGuide === guide.id ? 'bg-github-card/60 border-github-link/30 shadow-lg' : 'bg-github-card/30 border-github-border/50 hover:border-github-border'}
            backdrop-blur-md
          `}
        >
          <button
            onClick={() => toggleGuide(guide.id)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`
                p-3 rounded-xl transition-colors
                ${openGuide === guide.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-500/10 text-blue-400'}
              `}>
                <BookOpen size={24} />
              </div>
              <div>
                <span className="font-bold text-xl text-github-heading block mb-1">{guide.title}</span>
                <span className="text-xs text-github-muted uppercase tracking-wider font-semibold">Step-by-Step Guide</span>
              </div>
            </div>
            <div className={`p-2 rounded-full transition-all duration-300 ${openGuide === guide.id ? 'bg-white/10 rotate-180' : 'bg-transparent'}`}>
              <ChevronDown className={openGuide === guide.id ? "text-white" : "text-github-muted"} size={20} />
            </div>
          </button>

          <div 
            className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${openGuide === guide.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-6 pt-0 border-t border-white/5">
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-github-muted uppercase tracking-wider pl-2">Execution Steps</h4>
                  <ol className="relative border-l-2 border-github-border/50 ml-3 space-y-8">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="ml-8 relative">
                        <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-github-dark border-2 border-github-link text-github-link font-bold text-sm shadow-md z-10">
                          {index + 1}
                        </span>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                           <h5 className="font-bold text-github-heading mb-1">{step.title}</h5>
                           <p className="text-sm text-github-muted leading-relaxed">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-6 h-fit sticky top-24">
                   <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <Lightbulb size={18} /> Pro Tips
                   </h4>
                   <ul className="space-y-3">
                      {guide.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm text-yellow-100/80">
                          <span className="text-yellow-500 font-bold">•</span>
                          {tip}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuideSection;
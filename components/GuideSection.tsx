import React, { useState } from 'react';
import { GUIDES } from '../data/badges';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';

const GuideSection: React.FC = () => {
  const [openGuide, setOpenGuide] = useState<string | null>(GUIDES[0].id);

  const toggleGuide = (id: string) => {
    setOpenGuide(openGuide === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {GUIDES.map((guide) => (
        <div key={guide.id} className="border border-github-border rounded-xl bg-github-card overflow-hidden">
          <button
            onClick={() => toggleGuide(guide.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-github-dark/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <BookOpen size={20} />
              </div>
              <span className="font-semibold text-lg text-github-text">{guide.title}</span>
            </div>
            {openGuide === guide.id ? <ChevronUp className="text-github-muted" /> : <ChevronDown className="text-github-muted" />}
          </button>

          {openGuide === guide.id && (
            <div className="p-4 pt-0 border-t border-github-border/50 bg-github-dark/30">
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-github-muted uppercase tracking-wider">Steps to Earn</h4>
                  <ol className="relative border-l border-github-border ml-3 space-y-6">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="ml-6">
                        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-github-link text-white text-xs ring-4 ring-github-card">
                          {index + 1}
                        </span>
                        <h5 className="font-medium text-github-text leading-tight mb-1">{step.title}</h5>
                        <p className="text-sm text-github-muted">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 h-fit">
                   <h4 className="text-sm font-semibold text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <Lightbulb size={16} /> Pro Tips
                   </h4>
                   <ul className="list-disc list-inside space-y-2 text-sm text-github-text/80">
                      {guide.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                   </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GuideSection;
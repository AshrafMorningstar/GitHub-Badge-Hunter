import React from 'react';
import { Badge, BadgeRarity } from '../types';
import { X, Award, Shield, CheckCircle, Target, Star, AlertTriangle, Lock, Image as ImageIcon, Loader2 } from 'lucide-react';

interface BadgeDetailModalProps {
  badge: Badge;
  onClose: () => void;
  isOwned: boolean;
  onToggleOwned: () => void;
  imageUrl?: string;
  onGenerateImage: (e: React.MouseEvent) => void;
  isGenerating: boolean;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ badge, onClose, isOwned, onToggleOwned, imageUrl, onGenerateImage, isGenerating }) => {
  const rarityColors = {
    [BadgeRarity.COMMON]: 'from-gray-500/20 to-transparent',
    [BadgeRarity.RARE]: 'from-blue-500/20 to-transparent',
    [BadgeRarity.EPIC]: 'from-purple-500/20 to-transparent',
    [BadgeRarity.LEGENDARY]: 'from-yellow-500/20 to-transparent',
  };

  const rarityText = {
    [BadgeRarity.COMMON]: 'text-gray-400',
    [BadgeRarity.RARE]: 'text-blue-400',
    [BadgeRarity.EPIC]: 'text-purple-400',
    [BadgeRarity.LEGENDARY]: 'text-yellow-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#0d1117] border border-github-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto ring-1 ring-white/10">
        
        {/* Decorative Top Gradient */}
        <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${rarityColors[badge.rarity]} pointer-events-none opacity-50`}></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-20 backdrop-blur-md"
        >
          <X size={20} />
        </button>

        <div className="relative p-8 pt-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left Column: Image/Emoji & Status */}
            <div className="flex flex-col items-center gap-6 shrink-0 mx-auto md:mx-0 w-full md:w-auto">
              <div className="relative group w-48 h-48">
                {imageUrl ? (
                   <div className="w-full h-full rounded-2xl border border-github-border shadow-2xl overflow-hidden bg-black ring-4 ring-black/20">
                     <img src={imageUrl} alt={badge.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                   </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl bg-github-dark/50 rounded-2xl border border-github-border shadow-inner backdrop-blur-sm">
                    {badge.emoji}
                  </div>
                )}
                
                {!imageUrl && (
                  <button 
                    onClick={onGenerateImage}
                    disabled={isGenerating}
                    className="absolute bottom-3 right-3 p-2 bg-github-card/90 border border-github-border rounded-lg text-github-text hover:text-github-link hover:border-github-link shadow-lg transition-all flex items-center gap-2 text-xs font-medium backdrop-blur-md"
                  >
                     {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                     {isGenerating ? 'Designing...' : 'Generate Art'}
                  </button>
                )}
              </div>

              <button
                onClick={onToggleOwned}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all w-full justify-center transform active:scale-95
                  ${isOwned 
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/30 ring-1 ring-green-400/50' 
                    : 'bg-github-border/50 hover:bg-github-border text-github-text border border-white/5'}
                `}
              >
                {isOwned ? (
                  <>
                    <CheckCircle size={18} /> Collected
                  </>
                ) : (
                  <>
                    <Target size={18} /> Mark as Owned
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Details */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className={`text-xs font-bold uppercase tracking-wider ${rarityText[badge.rarity]}`}>
                     {badge.rarity}
                   </span>
                   {badge.tiers && (
                     <span className="text-xs text-github-muted bg-github-border/30 px-2 py-0.5 rounded-full border border-white/5">
                       Multi-Tier
                     </span>
                   )}
                </div>
                
                <h2 className="text-4xl font-extrabold text-github-heading mb-3 tracking-tight">{badge.name}</h2>
                <p className="text-github-text text-lg leading-relaxed opacity-90">{badge.description}</p>
              </div>

              <div className="space-y-6">
                
                {/* How to Earn */}
                <div className="bg-github-dark/40 rounded-xl p-5 border border-github-border/50 shadow-inner backdrop-blur-sm">
                  <h3 className="text-xs font-bold text-github-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Award size={14} className="text-github-accent" /> Earning Strategy
                  </h3>
                  <p className="text-github-heading font-medium">{badge.howToEarn}</p>
                </div>

                {/* Tiers */}
                {badge.tiers && (
                  <div>
                    <h3 className="text-xs font-bold text-github-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" /> Progression Tiers
                    </h3>
                    <div className="grid gap-2">
                      {badge.tiers.map((tier) => (
                        <div key={tier.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full shadow-lg ${
                              tier.name === 'Gold' ? 'bg-yellow-400 shadow-yellow-400/50' : 
                              tier.name === 'Silver' ? 'bg-gray-300 shadow-gray-300/50' : 
                              tier.name === 'Bronze' ? 'bg-amber-700 shadow-amber-700/50' : 'bg-blue-400 shadow-blue-400/50'
                            }`}></span>
                            <span className="font-semibold text-github-text">{tier.name}</span>
                          </div>
                          <span className="font-mono text-sm text-github-muted bg-black/20 px-2 py-0.5 rounded">{tier.requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {badge.notes && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                    <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200/80 leading-relaxed">{badge.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDetailModal;
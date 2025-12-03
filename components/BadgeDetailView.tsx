import React, { useEffect } from 'react';
import { Badge, BadgeRarity } from '../types';
import { ArrowLeft, Award, Shield, CheckCircle, Target, Star, AlertTriangle, Image as ImageIcon, Loader2, Share2, Sparkles } from 'lucide-react';

interface BadgeDetailViewProps {
  badge: Badge;
  onBack: () => void;
  isOwned: boolean;
  onToggleOwned: () => void;
  imageUrl?: string;
  onGenerateImage: (e: React.MouseEvent) => void;
  isGenerating: boolean;
}

const BadgeDetailView: React.FC<BadgeDetailViewProps> = ({ 
  badge, 
  onBack, 
  isOwned, 
  onToggleOwned, 
  imageUrl, 
  onGenerateImage, 
  isGenerating 
}) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const rarityBorder = {
    [BadgeRarity.COMMON]: 'border-gray-500/30',
    [BadgeRarity.RARE]: 'border-blue-500/30',
    [BadgeRarity.EPIC]: 'border-purple-500/30',
    [BadgeRarity.LEGENDARY]: 'border-yellow-500/30',
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto pb-12 pt-6">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-github-muted hover:text-white mb-8 transition-all px-4 py-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
      >
        <div className="p-1.5 rounded-full bg-github-border/30 group-hover:bg-github-border transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span className="font-medium">Back to Gallery</span>
      </button>

      <div className={`relative overflow-hidden rounded-[2rem] border ${rarityBorder[badge.rarity]} bg-github-card/40 backdrop-blur-2xl shadow-2xl`}>
        
        {/* Background Gradient Effect */}
        <div className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-b ${rarityColors[badge.rarity]} opacity-20 pointer-events-none`}></div>
        
        <div className="relative p-6 md:p-12 flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Visuals & Actions */}
          <div className="flex flex-col items-center w-full lg:w-1/3 shrink-0">
            <div className="relative group w-72 h-72 md:w-96 md:h-96 mb-10 perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl transform rotate-6 scale-95 opacity-50 blur-sm transition-all duration-700 group-hover:rotate-12 group-hover:scale-100"></div>
              
              {imageUrl ? (
                 <div className="relative w-full h-full rounded-3xl border border-github-border/50 shadow-2xl overflow-hidden bg-black/50 ring-1 ring-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                   <img src={imageUrl} alt={badge.name} className="w-full h-full object-cover" />
                 </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center text-9xl bg-github-dark/50 rounded-3xl border border-github-border/50 shadow-inner backdrop-blur-md group-hover:scale-[1.02] transition-transform duration-500">
                  <span className="filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    {badge.emoji}
                  </span>
                </div>
              )}
              
              {!imageUrl && (
                <button 
                  onClick={onGenerateImage}
                  disabled={isGenerating}
                  className="absolute -bottom-5 -right-5 p-4 bg-github-card/90 border border-github-border rounded-2xl text-github-text hover:text-github-link hover:border-github-link shadow-2xl transition-all flex items-center gap-3 font-medium backdrop-blur-xl z-20 hover:-translate-y-1 hover:scale-105"
                >
                   {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                   {isGenerating ? 'Designing...' : 'Visualize 3D'}
                </button>
              )}
            </div>

            <div className="w-full space-y-4 px-4 lg:px-0">
              <button
                onClick={onToggleOwned}
                className={`
                  w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-xl
                  ${isOwned 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-green-900/30 ring-1 ring-green-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-github-text border border-white/10 hover:border-white/20'}
                `}
              >
                {isOwned ? (
                  <>
                    <CheckCircle size={22} className="text-white" /> Collected
                  </>
                ) : (
                  <>
                    <Target size={22} /> Mark as Owned
                  </>
                )}
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm text-github-muted hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <Share2 size={16} /> Share Achievement
              </button>
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="flex-1 space-y-10 animate-fade-in-up">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${rarityBorder[badge.rarity]} ${rarityText[badge.rarity]} bg-white/5 shadow-sm`}>
                   {badge.rarity}
                 </span>
                 <span className="px-4 py-1.5 rounded-full text-xs font-medium text-github-muted bg-github-border/20 border border-github-border/30">
                   {badge.category}
                 </span>
                 {badge.tiers && (
                   <span className="px-4 py-1.5 rounded-full text-xs font-medium text-blue-300/80 bg-blue-500/10 border border-blue-500/20 flex items-center gap-1.5">
                     <Star size={12} fill="currentColor" /> Multi-Tier
                   </span>
                 )}
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-github-heading mb-6 tracking-tight drop-shadow-lg leading-tight">
                {badge.name}
              </h1>
              <p className="text-xl lg:text-2xl text-github-text leading-relaxed font-light opacity-90 border-l-4 border-github-border/50 pl-6 py-1">
                {badge.description}
              </p>
            </div>

            <div className="grid gap-8">
              
              {/* How to Earn Card */}
              <div className="bg-gradient-to-br from-github-card/80 to-github-dark/80 rounded-3xl p-8 border border-github-border/50 shadow-lg relative overflow-hidden group hover:border-github-border transition-colors">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity transform group-hover:scale-110 duration-700">
                  <Award size={180} />
                </div>
                <h3 className="text-sm font-bold text-github-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award size={18} /> How to Obtain
                </h3>
                <p className="text-xl text-github-heading font-medium leading-relaxed max-w-2xl">{badge.howToEarn}</p>
              </div>

              {/* Tiers Section */}
              {badge.tiers && (
                <div className="bg-github-dark/30 rounded-3xl p-8 border border-github-border/30 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-yellow-500/80 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Star size={18} /> Progression Tiers
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {badge.tiers.map((tier) => (
                      <div key={tier.name} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.07] group">
                        <div className="flex items-center gap-4">
                          <span className={`w-4 h-4 rounded-full shadow-lg ring-2 ring-white/10 ${
                            tier.name === 'Gold' ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-yellow-500/20' : 
                            tier.name === 'Silver' ? 'bg-gradient-to-br from-gray-100 to-gray-400 shadow-gray-500/20' : 
                            tier.name === 'Bronze' ? 'bg-gradient-to-br from-amber-600 to-amber-800 shadow-amber-500/20' : 
                            'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20'
                          }`}></span>
                          <span className="font-bold text-github-text text-lg">{tier.name}</span>
                        </div>
                        <span className="font-mono text-xs text-github-muted bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                          {tier.requirement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {badge.notes && (
                <div className="flex items-start gap-5 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-200/90 text-sm mb-2 uppercase tracking-wide">Important Note</h4>
                    <p className="text-base text-yellow-100/70 leading-relaxed">{badge.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDetailView;
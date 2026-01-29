import React from 'react';
import { Badge, BadgeType, BadgeRarity } from '../types';
import { Shield, Award, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  onClick: (badge: Badge) => void;
  isOwned: boolean;
  imageUrl?: string;
  onGenerateImage: (e: React.MouseEvent) => void;
  isGenerating: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onClick, isOwned, imageUrl, onGenerateImage, isGenerating }) => {
  const isRetired = badge.type === BadgeType.RETIRED;

  const rarityColor = {
    [BadgeRarity.COMMON]: 'text-gray-400 bg-gray-400/5 border-gray-400/10',
    [BadgeRarity.RARE]: 'text-blue-400 bg-blue-400/5 border-blue-400/10',
    [BadgeRarity.EPIC]: 'text-purple-400 bg-purple-400/5 border-purple-400/10',
    [BadgeRarity.LEGENDARY]: 'text-yellow-400 bg-yellow-400/5 border-yellow-400/10'
  };

  const rarityBorder = {
    [BadgeRarity.COMMON]: 'border-gray-500/20 hover:border-gray-500/40',
    [BadgeRarity.RARE]: 'border-blue-500/20 hover:border-blue-500/40',
    [BadgeRarity.EPIC]: 'border-purple-500/20 hover:border-purple-500/40',
    [BadgeRarity.LEGENDARY]: 'border-yellow-500/20 hover:border-yellow-500/40'
  };

  return (
    <div 
      id={`badge-card-${badge.id}`}
      onClick={() => onClick(badge)}
      className={`
        group relative overflow-hidden rounded-[1.25rem] border p-6 flex flex-col h-full cursor-pointer
        bg-github-card/40 backdrop-blur-md
        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        hover:scale-[1.05] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hover:bg-github-card/80 hover:-translate-y-2
        ${isRetired ? 'opacity-60 grayscale' : ''}
        ${isOwned ? 'ring-1 ring-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]' : ''}
        ${rarityBorder[badge.rarity] || 'border-github-border'}
      `}
    >
      {/* Subtle Gradient Glow effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Interactive Shine Effect */}
      <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:animate-shine pointer-events-none" />

      {/* Tooltip - Premium with delay and animation */}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300 bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-[#0d1117]/95 backdrop-blur-xl text-white text-xs p-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] pointer-events-none z-20 border border-white/10 transform translate-y-4 group-hover:translate-y-0">
        <div className="font-bold mb-2 flex items-center gap-1.5 text-github-link uppercase tracking-wide text-[10px]">
          <Award size={12} /> Objective
        </div>
        <p className="leading-relaxed opacity-90">{badge.howToEarn}</p>
        {/* Tooltip Arrow */}
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0d1117]/95 border-r border-b border-white/10 transform rotate-45"></div>
      </div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="relative group/icon">
          {imageUrl ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-github-border/50 group-hover:scale-105 transition-transform duration-500 bg-black shadow-lg">
              <img src={imageUrl} alt={badge.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 w-16 h-16 flex items-center justify-center filter drop-shadow-md">
              {badge.emoji}
            </div>
          )}
          
          {/* Generate Button */}
          {!imageUrl && (
            <button 
              onClick={onGenerateImage}
              disabled={isGenerating}
              className="absolute -bottom-2 -right-2 p-2 bg-github-dark border border-github-border rounded-full text-github-muted hover:text-github-link hover:border-github-link transition-all shadow-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              title="Visualize"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
            </button>
          )}
        </div>

        <div className="flex flex-col items-end gap-2.5">
          {isOwned ? (
            <span className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 rounded-full border border-green-500/20 shadow-sm animate-fade-in">
              <CheckCircle size={10} /> Owned
            </span>
          ) : (
             <span className="text-[10px] text-github-muted opacity-50 font-medium px-2.5 py-1 bg-black/20 rounded-full">Locked</span>
          )}
          
          {!isRetired && (
             <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${rarityColor[badge.rarity]}`}>
               {badge.rarity}
             </span>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-github-heading mb-1.5 group-hover:text-github-link transition-colors duration-300 line-clamp-1">{badge.name}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-github-muted/80 bg-github-border/30 px-2.5 py-0.5 rounded-md border border-white/5">
            {badge.category}
          </span>
        </div>

        <p className="text-github-muted text-sm leading-relaxed h-[42px] overflow-hidden line-clamp-2">
          {badge.description}
        </p>
      </div>

      <div className="mt-auto pt-5 space-y-3 relative z-10">
        {badge.tiers ? (
          <div className="flex flex-wrap gap-1.5">
             {badge.tiers.slice(0, 3).map((tier) => (
                <span key={tier.name} className="inline-flex items-center px-2 py-1 text-[10px] font-medium rounded-md bg-github-border/20 text-github-muted border border-github-border/30">
                  {tier.name}
                </span>
             ))}
             {badge.tiers.length > 3 && <span className="text-[10px] text-github-muted self-center px-1">+{badge.tiers.length - 3}</span>}
          </div>
        ) : (
          <div className="h-[26px]"></div> /* Spacer to align cards */
        )}
        
        {badge.notes && (
          <div className="flex items-start gap-2 text-xs text-yellow-500/90 mt-2 bg-yellow-500/5 p-2.5 rounded-lg border border-yellow-500/10">
            <Shield size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-1">{badge.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
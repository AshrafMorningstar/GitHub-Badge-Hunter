import React from 'react';
import { Badge, BadgeRarity } from '../types';
import { CheckCircle, ExternalLink, Shield } from 'lucide-react';

interface BadgeTableViewProps {
  badges: Badge[];
  ownedBadges: Set<string>;
  onBadgeClick: (badge: Badge) => void;
  badgeImages: Record<string, string>;
}

const BadgeTableView: React.FC<BadgeTableViewProps> = ({ badges, ownedBadges, onBadgeClick, badgeImages }) => {
  const rarityClass = {
    [BadgeRarity.COMMON]: 'text-gray-400 bg-gray-400/5 border-gray-400/20',
    [BadgeRarity.RARE]: 'text-blue-400 bg-blue-400/5 border-blue-400/20',
    [BadgeRarity.EPIC]: 'text-purple-400 bg-purple-400/5 border-purple-400/20',
    [BadgeRarity.LEGENDARY]: 'text-yellow-400 bg-yellow-400/5 border-yellow-400/20',
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-github-border bg-github-card shadow-sm animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-github-dark/50 border-b border-github-border text-xs uppercase tracking-wider text-github-muted">
              <th className="px-6 py-5 font-semibold w-20 text-center">Preview</th>
              <th className="px-6 py-5 font-semibold">Badge Details</th>
              <th className="px-6 py-5 font-semibold w-32 hidden sm:table-cell">Rarity</th>
              <th className="px-6 py-5 font-semibold w-32">Status</th>
              <th className="px-6 py-5 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-github-border/30">
            {badges.map((badge) => {
              const isOwned = ownedBadges.has(badge.id);
              const imageUrl = badgeImages[badge.id];

              return (
                <tr 
                  key={badge.id} 
                  onClick={() => onBadgeClick(badge)}
                  className="group hover:bg-github-dark/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-center">
                    {imageUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-github-border mx-auto bg-black">
                             <img src={imageUrl} alt={badge.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <span className="text-2xl group-hover:scale-110 transition-transform block">{badge.emoji}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-github-heading group-hover:text-github-link transition-colors text-sm sm:text-base">{badge.name}</span>
                      <span className="text-xs sm:text-sm text-github-muted line-clamp-1">{badge.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${rarityClass[badge.rarity]} uppercase tracking-wide`}>
                       {badge.rarity}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    {isOwned ? (
                      <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-xs font-semibold border border-green-400/20">
                        <CheckCircle size={12} /> Owned
                      </span>
                    ) : (
                      <span className="text-github-muted text-xs px-2 py-1">Not Owned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ExternalLink size={16} className="text-github-muted opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {badges.length === 0 && (
         <div className="p-16 text-center text-github-muted flex flex-col items-center gap-4">
           <div className="p-4 bg-github-dark rounded-full">
             <Shield size={32} className="opacity-20" />
           </div>
           <p>No badges found matching your filters.</p>
         </div>
      )}
    </div>
  );
};

export default BadgeTableView;
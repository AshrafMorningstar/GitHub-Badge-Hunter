import React from 'react';
import { Badge, BadgeType } from '../types';
import { Shield, Lock, Award } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const isRetired = badge.type === BadgeType.RETIRED;

  return (
    <div className={`
      relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-lg
      ${isRetired ? 'bg-github-dark border-github-border opacity-75' : 'bg-github-card border-github-border hover:border-github-link/50'}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{badge.emoji}</div>
        {isRetired && <span className="px-2 py-1 text-xs font-medium text-red-400 bg-red-900/20 rounded-full border border-red-900/50">Retired/Unreleased</span>}
        {!isRetired && badge.tiers && (
          <span className="px-2 py-1 text-xs font-medium text-github-accent bg-github-accent/10 rounded-full border border-github-accent/20">
            Multi-Tier
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-github-text mb-2 group-hover:text-github-link">{badge.name}</h3>
      <p className="text-github-muted text-sm mb-4 h-10 overflow-hidden text-ellipsis line-clamp-2">
        {badge.description}
      </p>

      <div className="space-y-3">
        <div className="bg-github-dark/50 rounded-lg p-3 border border-github-border/50">
          <h4 className="text-xs uppercase tracking-wider text-github-muted font-semibold mb-1 flex items-center gap-1">
            <Award size={12} /> How to Earn
          </h4>
          <p className="text-sm text-github-text">{badge.howToEarn}</p>
        </div>

        {badge.tiers && (
          <div className="space-y-2">
             <h4 className="text-xs uppercase tracking-wider text-github-muted font-semibold">Tiers</h4>
             <div className="flex flex-wrap gap-2">
                {badge.tiers.map((tier) => (
                  <span key={tier.name} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-github-border/50 text-github-text border border-github-border">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      tier.name === 'Gold' ? 'bg-yellow-400' : 
                      tier.name === 'Silver' ? 'bg-gray-300' : 
                      tier.name === 'Bronze' ? 'bg-amber-700' : 'bg-blue-400'
                    }`}></span>
                    {tier.name}: {tier.requirement}
                  </span>
                ))}
             </div>
          </div>
        )}
        
        {badge.notes && (
          <div className="flex items-start gap-2 text-xs text-yellow-500/80 mt-2">
            <Shield size={12} className="mt-0.5" />
            <span>{badge.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
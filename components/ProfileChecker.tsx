import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Trophy, Star, GitPullRequest, MessageCircle, ExternalLink } from 'lucide-react';
import { fetchUserStats } from '../services/githubService';
import { UserStats, Badge, BadgeTier } from '../types';
import { BADGES } from '../data/badges';

interface ProgressProps {
  current: number;
  tiers: BadgeTier[];
  colorClass: string;
}

const ProgressBar: React.FC<ProgressProps> = ({ current, tiers, colorClass }) => {
  // Find current tier
  let currentTierIndex = -1;
  for (let i = 0; i < tiers.length; i++) {
    if (tiers[i].threshold && current >= tiers[i].threshold!) {
      currentTierIndex = i;
    } else {
      break;
    }
  }

  const currentTier = currentTierIndex >= 0 ? tiers[currentTierIndex] : null;
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

  // Calculate percentage to next tier
  let progress = 0;
  let label = '';
  
  if (!nextTier) {
    // Maxed out
    progress = 100;
    label = "Max Tier Reached! 🏆";
  } else if (!currentTier) {
    // Haven't reached first tier
    const target = nextTier.threshold || 1;
    progress = Math.min(100, (current / target) * 100);
    label = `${current} / ${target} to ${nextTier.name}`;
  } else {
    // Between tiers
    const prevThreshold = currentTier.threshold || 0;
    const nextThreshold = nextTier.threshold || 100;
    const range = nextThreshold - prevThreshold;
    const progressInTier = current - prevThreshold;
    progress = Math.min(100, (progressInTier / range) * 100);
    label = `${current} / ${nextThreshold} to ${nextTier.name}`;
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-github-text">
          Current: {currentTier ? currentTier.name : 'None'}
        </span>
        <span className="text-github-muted">{label}</span>
      </div>
      <div className="h-2.5 w-full bg-github-dark rounded-full overflow-hidden border border-github-border">
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const ProfileChecker: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    setStats(null);
    
    try {
      const data = await fetchUserStats(username);
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (id: string) => BADGES.find(b => b.id === id);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Check Your Progress</h2>
        <p className="text-github-muted">
          Enter a real GitHub username to check live progress against badge requirements.
          <br />
          <span className="text-xs opacity-70 text-yellow-500/80">* Rate limited: ~60 requests/hour.</span>
        </p>
      </div>

      <div className="flex gap-2 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-github-muted" size={18} />
          <input
            type="text"
            placeholder="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            className="w-full bg-github-card border border-github-border rounded-lg pl-10 pr-4 py-3 text-github-text focus:border-github-link focus:ring-1 focus:ring-github-link outline-none transition-all"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading || !username.trim()}
          className="bg-github-accent hover:bg-github-accentHover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Check'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {stats && (
        <div className="bg-github-card border border-github-border rounded-2xl p-6 shadow-xl animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-github-border pb-6">
            <a href={`https://github.com/${stats.username}`} target="_blank" rel="noreferrer" className="shrink-0 hover:opacity-80 transition-opacity">
              <img 
                src={stats.avatarUrl} 
                alt={stats.username} 
                className="w-24 h-24 rounded-full border-4 border-github-border"
              />
            </a>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                {stats.name}
                <a href={`https://github.com/${stats.username}`} target="_blank" rel="noreferrer" className="text-github-muted hover:text-github-link">
                  <ExternalLink size={16} />
                </a>
              </h3>
              <p className="text-github-muted font-mono">@{stats.username}</p>
              {stats.bio && <p className="text-sm text-github-text mt-2 max-w-md">{stats.bio}</p>}
              
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-xs text-github-muted">
                <span className="bg-github-border/30 px-2 py-1 rounded">📦 {stats.publicRepos} Repos</span>
                <span className="bg-github-border/30 px-2 py-1 rounded">⭐ {stats.totalStars} Total Stars</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Pull Shark */}
            <div className="relative">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                   <GitPullRequest size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-white">Pull Shark</h4>
                   <p className="text-xs text-github-muted">Merged Pull Requests: {stats.mergedPRs}</p>
                 </div>
               </div>
               <ProgressBar 
                 current={stats.mergedPRs} 
                 tiers={getBadge('pull-shark')?.tiers || []} 
                 colorClass="bg-blue-500"
               />
            </div>

            {/* Starstruck */}
            <div className="relative">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                   <Star size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-white">Starstruck</h4>
                   <p className="text-xs text-github-muted">
                     Best Repo: {stats.bestRepoName ? <span className="text-white font-medium">{stats.bestRepoName}</span> : 'N/A'} ({stats.maxStarCount} stars)
                   </p>
                 </div>
               </div>
               <ProgressBar 
                 current={stats.maxStarCount} 
                 tiers={getBadge('starstruck')?.tiers || []} 
                 colorClass="bg-yellow-500"
               />
            </div>

             {/* Galaxy Brain */}
             <div className="relative">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                   <MessageCircle size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-white">Galaxy Brain</h4>
                   <p className="text-xs text-github-muted">Accepted Answers: {stats.acceptedAnswers}</p>
                 </div>
               </div>
               <ProgressBar 
                 current={stats.acceptedAnswers} 
                 tiers={getBadge('galaxy-brain')?.tiers || []} 
                 colorClass="bg-purple-500"
               />
            </div>

            <div className="text-center pt-4 border-t border-github-border mt-4">
               <p className="text-xs text-github-muted">
                 Note: <span className="text-white">Quickdraw</span>, <span className="text-white">Pair Extraordinaire</span>, and <span className="text-white">YOLO</span> cannot be accurately tracked via the public API without authentication.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileChecker;
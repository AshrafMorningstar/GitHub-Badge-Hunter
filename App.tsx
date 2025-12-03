import React, { useState, useEffect, useLayoutEffect } from 'react';
import { BADGES, FAQS } from './data/badges';
import { BadgeType, Badge, BadgeRarity, BadgeCategory } from './types';
import BadgeCard from './components/BadgeCard';
import BadgeTableView from './components/BadgeTableView';
import BadgeDetailView from './components/BadgeDetailView';
import GuideSection from './components/GuideSection';
import ChatAssistant from './components/ChatAssistant';
import ProfileChecker from './components/ProfileChecker';
import ProjectDiagram from './components/ProjectDiagram';
import { generateBadgeImage } from './services/geminiService';
import { Github, Search, AlertCircle, CheckCircle2, HelpCircle, Trophy, UserCircle, Sun, Moon, LayoutGrid, List, Filter, ArrowUpDown, Tag, Info } from 'lucide-react';

enum Tab {
  EARNABLE = 'earnable',
  HIGHLIGHTS = 'highlights',
  RETIRED = 'retired',
  GUIDES = 'guides',
  FAQ = 'faq',
  PROFILE = 'profile',
  ABOUT = 'about'
}

type SortOption = 'name' | 'rarity' | 'category';
type FilterOption = 'all' | 'owned' | 'unowned';
type CategoryFilter = 'all' | BadgeCategory;
type ViewMode = 'grid' | 'table';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.EARNABLE);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [lastActiveBadgeId, setLastActiveBadgeId] = useState<string | null>(null);
  
  const [ownedBadges, setOwnedBadges] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ownedBadges');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  
  // Image State
  const [badgeImages, setBadgeImages] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('badgeImages');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(new Set());

  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
      document.body.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll Restoration Logic
  useLayoutEffect(() => {
    if (!activeBadge && lastActiveBadgeId) {
      // Small timeout to allow DOM to render
      const timer = setTimeout(() => {
        const element = document.getElementById(`badge-card-${lastActiveBadgeId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setLastActiveBadgeId(null); // Reset after scrolling
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeBadge, lastActiveBadgeId]);

  const handleBadgeClick = (badge: Badge) => {
    setLastActiveBadgeId(badge.id);
    setActiveBadge(badge);
  };

  // Persist Data
  useEffect(() => {
    localStorage.setItem('ownedBadges', JSON.stringify(Array.from(ownedBadges)));
  }, [ownedBadges]);

  useEffect(() => {
    try {
      localStorage.setItem('badgeImages', JSON.stringify(badgeImages));
    } catch (e) {
      console.warn("LocalStorage full, cannot save images");
    }
  }, [badgeImages]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleOwned = (badgeId: string) => {
    setOwnedBadges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(badgeId)) {
        newSet.delete(badgeId);
      } else {
        newSet.add(badgeId);
      }
      return newSet;
    });
  };

  const handleGenerateImage = async (e: React.MouseEvent, badge: Badge) => {
    e.stopPropagation();
    if (generatingImages.has(badge.id) || badgeImages[badge.id]) return;

    setGeneratingImages(prev => new Set(prev).add(badge.id));
    const imageUrl = await generateBadgeImage(badge.name, badge.emoji, badge.description);
    if (imageUrl) {
      setBadgeImages(prev => ({ ...prev, [badge.id]: imageUrl }));
    }
    setGeneratingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(badge.id);
      return newSet;
    });
  };

  const getFilteredBadges = () => {
    let filtered = BADGES.filter(b => {
      if (activeTab === Tab.EARNABLE && b.type !== BadgeType.ACHIEVEMENT) return false;
      if (activeTab === Tab.HIGHLIGHTS && b.type !== BadgeType.HIGHLIGHT) return false;
      if (activeTab === Tab.RETIRED && b.type !== BadgeType.RETIRED) return false;

      const term = searchTerm.toLowerCase();
      const matchesSearch = b.name.toLowerCase().includes(term) || 
                            b.description.toLowerCase().includes(term) ||
                            b.howToEarn.toLowerCase().includes(term) ||
                            (b.notes && b.notes.toLowerCase().includes(term));
      
      if (!matchesSearch) return false;
      if (filterOption === 'owned' && !ownedBadges.has(b.id)) return false;
      if (filterOption === 'unowned' && ownedBadges.has(b.id)) return false;
      if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;

      return true;
    });

    filtered.sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'rarity') {
        const rarityOrder = {
          [BadgeRarity.COMMON]: 1,
          [BadgeRarity.RARE]: 2,
          [BadgeRarity.EPIC]: 3,
          [BadgeRarity.LEGENDARY]: 4
        };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      }
      if (sortOption === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

    return filtered;
  };

  const filteredBadges = getFilteredBadges();
  const isBadgeTab = activeTab === Tab.EARNABLE || activeTab === Tab.HIGHLIGHTS || activeTab === Tab.RETIRED;

  const TabButton = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => { setActiveTab(id); setActiveBadge(null); }}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap relative overflow-hidden group
        ${activeTab === id 
          ? 'text-white shadow-lg shadow-blue-500/25 scale-105' 
          : 'text-github-muted hover:text-github-text hover:bg-white/5'}
      `}
    >
      {activeTab === id && (
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 transition-opacity"></div>
      )}
      <div className="relative flex items-center gap-2">
        <Icon size={16} />
        <span className="hidden sm:inline">{label}</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30 selection:text-white pb-24 overflow-x-hidden relative">
      
      {/* Premium Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[140px] animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] -right-[20%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[140px] animate-blob-delay mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] left-[10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[160px] animate-blob-reverse mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
      </div>

      {/* Hero Header - Only visible when not in detail view */}
      {!activeBadge && (
        <header className="pt-20 pb-12 px-6 relative z-10">
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <div className="relative hidden md:block w-72 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-github-dark/80 backdrop-blur-md border border-github-border rounded-full flex items-center px-4 py-2 transition-all group-focus-within:border-github-link">
                <Search className="text-github-muted mr-3" size={16} />
                <input 
                  type="text" 
                  placeholder="Search badges..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-github-text w-full placeholder-github-muted/70"
                />
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-github-card/50 border border-github-border hover:bg-github-card text-github-text transition-all shadow-sm backdrop-blur-md hover:scale-110 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="max-w-6xl mx-auto text-center animate-fade-in-up">
            <div 
               onClick={() => { setActiveBadge(null); setActiveTab(Tab.EARNABLE); }}
               className="cursor-pointer inline-flex items-center justify-center p-5 bg-gradient-to-br from-github-card to-github-dark border border-github-border/50 rounded-[2rem] mb-8 shadow-2xl shadow-blue-900/20 backdrop-blur-xl relative group transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Github size={64} className="text-github-heading relative z-10" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-github-heading tracking-tight mb-6 drop-shadow-lg">
              GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse-slow">Badge Hunter</span>
            </h1>
            <p className="text-xl text-github-muted max-w-2xl mx-auto leading-relaxed font-light opacity-90">
              The definitive guide to collecting every achievement. <br className="hidden md:block"/>
              Master the platform, track your progress, and visualize success.
            </p>
          </div>
        </header>
      )}

      {/* Conditional Rendering: Detail View or Main Gallery */}
      {activeBadge ? (
         <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            {/* Header Mini for Detail View */}
            <div className="flex justify-end pt-6 pb-2">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-full bg-github-card/50 border border-github-border hover:bg-github-card text-github-text transition-all shadow-sm backdrop-blur-md"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            <BadgeDetailView 
              badge={activeBadge}
              onBack={() => setActiveBadge(null)}
              isOwned={ownedBadges.has(activeBadge.id)}
              onToggleOwned={() => toggleOwned(activeBadge.id)}
              imageUrl={badgeImages[activeBadge.id]}
              onGenerateImage={(e) => handleGenerateImage(e, activeBadge)}
              isGenerating={generatingImages.has(activeBadge.id)}
            />
         </div>
      ) : (
        <>
          {/* Navigation & Controls Bar */}
          <div className="sticky top-6 z-40 max-w-6xl mx-auto px-4 mb-10">
            <div className="glass-panel border border-github-border/60 rounded-2xl p-2 shadow-2xl shadow-black/20 flex flex-col lg:flex-row gap-4 justify-between items-center transition-all duration-300">
              
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto p-1 hide-scrollbar">
                <TabButton id={Tab.EARNABLE} label="Achievements" icon={Trophy} />
                <TabButton id={Tab.HIGHLIGHTS} label="Highlights" icon={CheckCircle2} />
                <TabButton id={Tab.RETIRED} label="Legacy" icon={AlertCircle} />
                <TabButton id={Tab.GUIDES} label="Guides" icon={Search} />
                <TabButton id={Tab.FAQ} label="FAQ" icon={HelpCircle} />
                <TabButton id={Tab.PROFILE} label="Checker" icon={UserCircle} />
                <TabButton id={Tab.ABOUT} label="About" icon={Info} />
              </div>

              {isBadgeTab && (
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end px-2 lg:px-0">
                   {/* Mobile Search */}
                   <div className="relative lg:hidden w-full sm:w-auto flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-github-muted" size={14} />
                     <input 
                       type="text" 
                       placeholder="Search..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full bg-github-dark/50 border border-github-border rounded-lg pl-9 pr-3 py-2 text-sm text-github-text focus:border-github-link focus:outline-none"
                     />
                   </div>

                   {/* Sort & Filters */}
                   <div className="flex gap-2 bg-github-dark/30 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                     <div className="relative group">
                       <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-github-text hover:text-white transition-colors rounded-lg hover:bg-white/5">
                         <ArrowUpDown size={14} />
                         <span className="hidden sm:inline font-medium">
                           {sortOption === 'name' ? 'Name' : sortOption === 'rarity' ? 'Rarity' : 'Category'}
                         </span>
                       </button>
                       <select 
                         value={sortOption}
                         onChange={(e) => setSortOption(e.target.value as SortOption)}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       >
                         <option value="name">Sort: Name</option>
                         <option value="rarity">Sort: Rarity</option>
                         <option value="category">Sort: Category</option>
                       </select>
                     </div>

                     <div className="w-px bg-github-border/50 my-1"></div>

                     <div className="relative group">
                       <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-github-text hover:text-white transition-colors rounded-lg hover:bg-white/5">
                         <Filter size={14} />
                         <span className="hidden sm:inline font-medium">
                           {filterOption === 'all' ? 'All Status' : filterOption === 'owned' ? 'Owned' : 'Unowned'}
                         </span>
                       </button>
                       <select 
                         value={filterOption}
                         onChange={(e) => setFilterOption(e.target.value as FilterOption)}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       >
                         <option value="all">Status: All</option>
                         <option value="owned">Status: Owned</option>
                         <option value="unowned">Status: Unowned</option>
                       </select>
                     </div>

                     <div className="w-px bg-github-border/50 my-1"></div>

                     <div className="relative group">
                       <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-github-text hover:text-white transition-colors rounded-lg hover:bg-white/5">
                         <Tag size={14} />
                         <span className="hidden sm:inline font-medium">
                           {categoryFilter === 'all' ? 'All Cats' : categoryFilter}
                         </span>
                       </button>
                       <select 
                         value={categoryFilter}
                         onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       >
                         <option value="all">Category: All</option>
                         {Object.values(BadgeCategory).map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                         ))}
                       </select>
                     </div>
                   </div>

                   {/* View Toggle */}
                   <div className="flex bg-github-dark/30 border border-white/5 rounded-lg p-1 backdrop-blur-sm">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-github-muted hover:text-white'}`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button 
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white/10 text-white shadow-sm' : 'text-github-muted hover:text-white'}`}
                      >
                        <List size={16} />
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            <div className="animate-fade-in-up">
              
              {isBadgeTab && (
                <>
                  {filteredBadges.length > 0 ? (
                    viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBadges.map((badge) => (
                          <BadgeCard 
                            key={badge.id} 
                            badge={badge} 
                            onClick={() => handleBadgeClick(badge)} 
                            isOwned={ownedBadges.has(badge.id)}
                            imageUrl={badgeImages[badge.id]}
                            onGenerateImage={(e) => handleGenerateImage(e, badge)}
                            isGenerating={generatingImages.has(badge.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <BadgeTableView 
                        badges={filteredBadges} 
                        ownedBadges={ownedBadges} 
                        onBadgeClick={(b) => handleBadgeClick(b)}
                        badgeImages={badgeImages}
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-github-muted border-2 border-dashed border-github-border/50 rounded-3xl bg-github-card/20 backdrop-blur-sm">
                      <div className="p-6 bg-github-dark rounded-full mb-6 ring-4 ring-github-card shadow-xl">
                        <Search size={48} className="opacity-40" />
                      </div>
                      <p className="text-2xl font-bold text-github-heading">No badges found</p>
                      <p className="text-base mt-2 max-w-md text-center opacity-80">We couldn't find any badges matching your current filters. Try adjusting your search or category.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setFilterOption('all'); setCategoryFilter('all');}}
                        className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors"
                      >
                        Reset all filters
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeTab === Tab.GUIDES && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-github-heading mb-3">Mastery Guides</h2>
                    <p className="text-github-muted text-lg">Detailed walkthroughs to secure the most prestigious achievements.</p>
                  </div>
                  <GuideSection />
                </div>
              )}

              {activeTab === Tab.PROFILE && (
                <ProfileChecker />
              )}
              
              {activeTab === Tab.ABOUT && (
                <ProjectDiagram />
              )}

              {activeTab === Tab.FAQ && (
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-github-heading mb-3">Common Questions</h2>
                    <p className="text-github-muted text-lg">Everything you need to know about GitHub's achievement system.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                      <div key={idx} className="glass-panel border border-github-border/50 rounded-2xl p-6 hover:border-github-border transition-colors duration-300">
                        <h3 className="font-bold text-github-heading text-lg mb-3 flex items-start gap-3">
                          <span className="p-1 bg-blue-500/10 rounded-md text-blue-400 mt-0.5"><HelpCircle size={18} /></span>
                          {faq.question}
                        </h3>
                        <p className="text-github-muted leading-relaxed pl-10 opacity-90">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-8 bg-gradient-to-br from-red-900/10 to-red-900/5 border border-red-900/20 rounded-2xl backdrop-blur-sm">
                     <h3 className="text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
                       <AlertCircle size={24} /> Troubleshooting
                     </h3>
                     <div className="grid md:grid-cols-2 gap-6 text-github-text/80 text-sm">
                        <div className="space-y-2">
                           <strong className="block text-red-300">Delay</strong>
                           <p>Badges process asynchronously. It can take up to 24 hours for a new badge to appear on your profile.</p>
                        </div>
                        <div className="space-y-2">
                           <strong className="block text-red-300">Privacy Settings</strong>
                           <p>Contributions in private repositories only count if "Private contributions" are enabled in your profile settings.</p>
                        </div>
                     </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </>
      )}

      <ChatAssistant />
      
      <footer className="mt-24 border-t border-github-border/50 py-12 text-center text-github-muted text-sm relative z-10 bg-github-dark/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-medium text-github-text">Built with React & Tailwind. Not affiliated with GitHub.</p>
          <p className="mt-2 opacity-60">Based on community research and the official GitHub Achievements guide.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
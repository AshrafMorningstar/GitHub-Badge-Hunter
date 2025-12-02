import React, { useState } from 'react';
import { BADGES, FAQS } from './data/badges';
import { BadgeType } from './types';
import BadgeCard from './components/BadgeCard';
import GuideSection from './components/GuideSection';
import ChatAssistant from './components/ChatAssistant';
import ProfileChecker from './components/ProfileChecker';
import { Github, Search, AlertCircle, CheckCircle2, HelpCircle, Trophy, UserCircle } from 'lucide-react';

enum Tab {
  EARNABLE = 'earnable',
  HIGHLIGHTS = 'highlights',
  RETIRED = 'retired',
  GUIDES = 'guides',
  FAQ = 'faq',
  PROFILE = 'profile'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.EARNABLE);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBadges = BADGES.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === Tab.EARNABLE) return b.type === BadgeType.ACHIEVEMENT;
    if (activeTab === Tab.HIGHLIGHTS) return b.type === BadgeType.HIGHLIGHT;
    if (activeTab === Tab.RETIRED) return b.type === BadgeType.RETIRED;
    return false;
  });

  const TabButton = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${activeTab === id 
          ? 'bg-github-link text-white shadow-md' 
          : 'text-github-muted hover:text-github-text hover:bg-github-border/50'}
      `}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-github-dark font-sans selection:bg-github-accent/30 selection:text-white pb-20">
      
      {/* Hero Header */}
      <header className="bg-github-card border-b border-github-border pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-github-border/30 rounded-full mb-6">
            <Github size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            GitHub Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-github-link to-purple-400">Badges</span> & Achievements
          </h1>
          <p className="text-lg text-github-muted max-w-2xl mx-auto leading-relaxed">
            The definitive community guide to collecting every badge on GitHub. 
            Discover hidden achievements, master the requirements, and level up your profile.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-8">
        
        {/* Navigation & Search */}
        <div className="bg-github-card/80 backdrop-blur-md border border-github-border rounded-xl p-2 sticky top-4 z-40 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              <TabButton id={Tab.EARNABLE} label="Achievements" icon={Trophy} />
              <TabButton id={Tab.HIGHLIGHTS} label="Highlights" icon={CheckCircle2} />
              <TabButton id={Tab.RETIRED} label="Retired" icon={AlertCircle} />
              <TabButton id={Tab.GUIDES} label="Guides" icon={Search} />
              <TabButton id={Tab.FAQ} label="FAQ" icon={HelpCircle} />
              <TabButton id={Tab.PROFILE} label="Check Profile" icon={UserCircle} />
            </div>

            {(activeTab === Tab.EARNABLE || activeTab === Tab.HIGHLIGHTS || activeTab === Tab.RETIRED) && (
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-github-muted" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter badges..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-github-dark border border-github-border rounded-lg pl-10 pr-4 py-2 text-sm text-github-text focus:border-github-link focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="animate-fade-in">
          
          {/* Badge Grid Views */}
          {(activeTab === Tab.EARNABLE || activeTab === Tab.HIGHLIGHTS || activeTab === Tab.RETIRED) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
              {filteredBadges.length === 0 && (
                <div className="text-center py-20 text-github-muted">
                  <p className="text-xl">No badges found matching "{searchTerm}"</p>
                </div>
              )}
            </>
          )}

          {/* Guides View */}
          {activeTab === Tab.GUIDES && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">In-Depth Guides</h2>
                <p className="text-github-muted">Step-by-step instructions for the most sought-after achievements.</p>
              </div>
              <GuideSection />
            </div>
          )}

          {/* Profile Check View */}
          {activeTab === Tab.PROFILE && (
            <ProfileChecker />
          )}

          {/* FAQ View */}
          {activeTab === Tab.FAQ && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h2>
                <p className="text-github-muted">Everything you need to know about how achievements work.</p>
              </div>
              
              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="bg-github-card border border-github-border rounded-xl p-6">
                    <h3 className="font-semibold text-white text-lg mb-3 flex items-start gap-3">
                      <span className="text-github-link mt-1"><HelpCircle size={20} /></span>
                      {faq.question}
                    </h3>
                    <p className="text-github-muted leading-relaxed pl-8">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Troubleshooting Box */}
              <div className="mt-12 p-6 bg-red-900/10 border border-red-900/30 rounded-xl">
                 <h3 className="text-red-400 font-bold text-lg mb-2 flex items-center gap-2">
                   <AlertCircle size={20} /> Why isn't my achievement showing up?
                 </h3>
                 <ul className="list-disc list-inside text-github-text/80 space-y-2 ml-2">
                   <li><strong>Time:</strong> It can take up to 24 hours for badges to process.</li>
                   <li><strong>Privacy:</strong> Contributions in private repos only count if you enabled "Private contributions" in profile settings.</li>
                   <li><strong>Email:</strong> Ensure your local git config email matches your GitHub account email.</li>
                   <li><strong>Forks:</strong> Commits to forks often don't count unless merged back to the upstream parent.</li>
                 </ul>
              </div>
            </div>
          )}

        </div>
      </main>

      <ChatAssistant />
      
      <footer className="mt-20 border-t border-github-border py-8 text-center text-github-muted text-sm">
        <p>Built with React & Tailwind. Not affiliated with GitHub.</p>
        <p className="mt-2">Based on community research and the official GitHub Achievements guide.</p>
      </footer>
    </div>
  );
};

export default App;

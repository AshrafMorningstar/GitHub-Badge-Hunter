import React from 'react';
import { Layers, Box, Cpu, Database, Layout, Smartphone, ArrowRight, Code, Terminal, Zap } from 'lucide-react';

const ProjectDiagram: React.FC = () => {
  const steps = [
    {
      icon: <Layout size={24} />,
      title: "UI Layer",
      desc: "React 19 + Tailwind",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      icon: <Box size={24} />,
      title: "Components",
      desc: "Atomic Design System",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      icon: <Database size={24} />,
      title: "Data Store",
      desc: "Local Storage & Static Data",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      icon: <Zap size={24} />,
      title: "Services",
      desc: "API Integration & Logic",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    }
  ];

  return (
    <div className="w-full animate-fade-in space-y-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-github-heading mb-4">Project Architecture</h2>
        <p className="text-xl text-github-muted max-w-2xl mx-auto">
          A high-level overview of the application structure, data flow, and technology stack designed for performance and scalability.
        </p>
      </div>

      {/* Main Flow Diagram */}
      <div className="relative max-w-5xl mx-auto">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-yellow-500/20 -translate-y-1/2 rounded-full z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex flex-col items-center text-center p-6 rounded-3xl border ${step.border} bg-github-card/80 backdrop-blur-xl shadow-xl hover:-translate-y-2 transition-transform duration-500`}>
              <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 shadow-inner`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-github-heading mb-2">{step.title}</h3>
              <p className="text-github-muted text-sm font-medium">{step.desc}</p>
              
              {idx < steps.length - 1 && (
                <div className="md:hidden mt-6 text-github-border">
                  <ArrowRight size={24} className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Technical Specs */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
        
        {/* Tech Stack */}
        <div className="p-8 rounded-[2rem] border border-github-border/50 bg-github-card/40 backdrop-blur-md">
          <h3 className="text-2xl font-bold text-github-heading mb-6 flex items-center gap-3">
            <Code className="text-github-accent" /> Tech Stack
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="font-semibold text-github-text">Frontend Framework</span>
              <span className="text-sm font-mono text-blue-300 bg-blue-500/10 px-3 py-1 rounded-lg">React 19</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="font-semibold text-github-text">Styling Engine</span>
              <span className="text-sm font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg">Tailwind CSS</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="font-semibold text-github-text">Icons</span>
              <span className="text-sm font-mono text-pink-300 bg-pink-500/10 px-3 py-1 rounded-lg">Lucide React</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="font-semibold text-github-text">Build Tool</span>
              <span className="text-sm font-mono text-yellow-300 bg-yellow-500/10 px-3 py-1 rounded-lg">ESBuild / Vite</span>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div className="p-8 rounded-[2rem] border border-github-border/50 bg-github-card/40 backdrop-blur-md">
          <h3 className="text-2xl font-bold text-github-heading mb-6 flex items-center gap-3">
            <Terminal className="text-purple-400" /> System Features
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <div className="mt-1 p-1 bg-green-500/20 rounded-full text-green-400">
                <ArrowRight size={12} />
              </div>
              <div>
                <strong className="block text-github-text">Responsive State Management</strong>
                <span className="text-sm text-github-muted">Uses React Hooks (useState, useEffect) for real-time UI updates and local persistence.</span>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="mt-1 p-1 bg-green-500/20 rounded-full text-green-400">
                <ArrowRight size={12} />
              </div>
              <div>
                <strong className="block text-github-text">Glassmorphism UI</strong>
                <span className="text-sm text-github-muted">Advanced CSS backdrop-filters and semi-transparent layers for depth.</span>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="mt-1 p-1 bg-green-500/20 rounded-full text-green-400">
                <ArrowRight size={12} />
              </div>
              <div>
                <strong className="block text-github-text">Dynamic Animations</strong>
                <span className="text-sm text-github-muted">CSS Keyframes for blobs, fades, and scale interactions.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectDiagram;
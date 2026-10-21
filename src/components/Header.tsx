'use client';

import React, { useState } from 'react';
import { ActiveTab } from '@/types';
import {
  Code2,
  FileCode,
  FileDown,
  Hexagon,
  Link2,
  Maximize,
  Minimize,
  ChevronDown,
  ExternalLink,
  Layers
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-14 bg-surface-card border-b border-surface-border px-4 flex items-center justify-between gap-4 select-none flex-shrink-0 z-50">
      <div className="flex items-center gap-3">
        <a href="https://apps.abishek.in" className="flex items-center gap-2 group text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">
                Base64<span className="text-blue-400">Studio</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
          </div>
        </a>

        {/* Suite Switcher */}
        <div className="relative">
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-surface-subtle hover:bg-surface-hover border border-surface-border px-2.5 py-1.5 rounded-md transition-colors"
          >
            <span>All Tools</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {switcherOpen && (
            <div
              className="absolute top-full left-0 mt-1.5 w-60 bg-surface-card border border-surface-border rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
              onMouseLeave={() => setSwitcherOpen(false)}
            >
              <a href="https://apps.abishek.in" className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 rounded-lg">
                🚀 Tools & Apps Hub (apps.abishek.in)
              </a>
              <div className="h-px bg-surface-border my-1" />
              <a href="https://base64.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600/20 rounded-lg">
                ⚡ Base64 Studio
              </a>
              <a href="https://compiler.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                💻 Web Compiler (HTML/CSS/JS)
              </a>
              <a href="https://json.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🌲 JSON Master Suite
              </a>
              <a href="https://md.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                📝 Markdown Studio Pro
              </a>
              <a href="https://prettier.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                ✨ Prettier Code Formatter
              </a>
              <a href="https://image.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🖼️ Image Compressor Pro
              </a>
              <a href="https://pdf.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                📄 PDF Toolkit
              </a>
              <a href="https://youtube.abishek.in" className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-hover rounded-lg">
                🎥 YouTube Downloader
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <nav className="flex items-center bg-surface-subtle border border-surface-border rounded-lg p-1 gap-1">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'text' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Text Encode/Decode</span>
        </button>

        <button
          onClick={() => setActiveTab('file')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'file' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>File to Base64</span>
        </button>

        <button
          onClick={() => setActiveTab('decode-file')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'decode-file' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Base64 to File</span>
        </button>

        <button
          onClick={() => setActiveTab('hex')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'hex' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Hexagon className="w-3.5 h-3.5" />
          <span>Hex ↔ Base64</span>
        </button>

        <button
          onClick={() => setActiveTab('uri')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'uri' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Data URI Inspector</span>
        </button>
      </nav>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        <a
          href="https://apps.abishek.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:opacity-90 shadow-sm"
        >
          <span>All Apps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
};

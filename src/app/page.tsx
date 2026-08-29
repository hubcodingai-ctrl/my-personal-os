'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { useOSStore } from '@/store/useOSStore';
import { X, Minus, Square, Copy, Bot, Youtube, Github, Terminal } from 'lucide-react';

const APPS = [
  { id: 'codespace', title: 'GitHub Codespace', icon: 'Terminal', url: 'https://github.dev' },
  { id: 'youtube', title: 'YouTube', icon: 'Youtube', url: 'https://www.youtube.com/embed' },
  { id: 'github', title: 'GitHub Main', icon: 'Github', url: 'https://github.com' },
  { id: 'ai-assistant', title: 'AI Assistant', icon: 'Bot' },
];

export default function OS() {
  const { windows, activeWindowId, openApp, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowBounds } = useOSStore();

  const getIcon = (icon: string) => {
    if (icon === 'Terminal') return <Terminal className="text-emerald-400" size={24} />;
    if (icon === 'Youtube') return <Youtube className="text-red-500" size={24} />;
    if (icon === 'Github') return <Github className="text-white" size={24} />;
    return <Bot className="text-cyan-400" size={24} />;
  };

  return (
    <main className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden select-none">
      {/* Dynamic Windows */}
      {windows.map((win) => {
        if (win.isMinimized) return null;
        const isActive = activeWindowId === win.id;

        return (
          <Rnd
            key={win.id}
            size={win.isMaximized ? { width: '100vw', height: 'calc(100vh - 60px)' } : win.size}
            position={win.isMaximized ? { x: 0, y: 0 } : win.position}
            onDragStop={(e, d) => !win.isMaximized && updateWindowBounds(win.id, { x: d.x, y: d.y }, win.size)}
            onResizeStop={(e, dir, ref, delta, pos) => !win.isMaximized && updateWindowBounds(win.id, pos, { width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}
            onMouseDown={() => focusWindow(win.id)}
            style={{ zIndex: win.zIndex }}
            className={`fixed flex flex-col rounded-xl overflow-hidden border ${isActive ? 'border-cyan-500 shadow-2xl' : 'border-gray-800'} bg-gray-900`}
          >
            {/* Titlebar */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-950 border-b border-gray-800 cursor-move">
              <span className="text-sm font-medium">{win.title}</span>
              <div className="flex gap-2">
                <button onClick={() => minimizeWindow(win.id)} className="p-1 hover:bg-gray-800 rounded"><Minus size={14} /></button>
                <button onClick={() => maximizeWindow(win.id)} className="p-1 hover:bg-gray-800 rounded">{win.isMaximized ? <Copy size={14} /> : <Square size={14} />}</button>
                <button onClick={() => closeWindow(win.id)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><X size={14} /></button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-black">
              {win.url ? (
                <iframe src={win.url} className="w-full h-full border-0" title={win.title} />
              ) : (
                <div className="p-4">
                  <h2 className="text-cyan-400 font-bold text-lg mb-2">Personal AI Companion</h2>
                  <p className="text-gray-400 text-sm">Hello! Main aapka AI OS Assistant hoon. Kya help chahiye?</p>
                </div>
              )}
            </div>
          </Rnd>
        );
      })}

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6 py-3 rounded-2xl bg-gray-900/90 border border-gray-800 backdrop-blur-md">
        {APPS.map((app) => (
          <button key={app.id} onClick={() => openApp(app)} className="p-2 hover:scale-110 transition">
            {getIcon(app.icon)}
          </button>
        ))}
      </div>
    </main>
  );
}

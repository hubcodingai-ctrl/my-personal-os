'use client';

import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useOSStore } from '@/store/useOSStore';
import { X, Minus, Square, Copy, Bot, Youtube, Github, Terminal, Search, Send } from 'lucide-react';

const APPS = [
  { id: 'codespace', title: 'GitHub Codespaces', icon: 'Terminal', url: 'https://github.com/codespaces' },
  { id: 'youtube', title: 'YouTube Stream', icon: 'Youtube', url: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk' },
  { id: 'github', title: 'GitHub Dashboard', icon: 'Github', url: 'https://github.com' },
  { id: 'google', title: 'Search Engine', icon: 'Search', url: 'https://www.bing.com' },
  { id: 'ai-assistant', title: 'AI Assistant', icon: 'Bot' },
];

export default function OS() {
  const { windows, activeWindowId, openApp, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowBounds } = useOSStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! Main aapka personal Web OS AI Assistant hoon. Main aapke system apps aur tasks me help kar sakta hoon.' }
  ]);
  const [input, setInput] = useState('');

  const getIcon = (icon: string) => {
    if (icon === 'Terminal') return <Terminal className="text-emerald-400" size={24} />;
    if (icon === 'Youtube') return <Youtube className="text-red-500" size={24} />;
    if (icon === 'Github') return <Github className="text-white" size={24} />;
    if (icon === 'Search') return <Search className="text-blue-400" size={24} />;
    return <Bot className="text-cyan-400" size={24} />;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    const userQuery = input;
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Aapne pucha: "${userQuery}". Main jald hi full Gemini AI execution engine se connect hone wala hoon!` }
      ]);
    }, 600);
  };

  return (
    <main className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden select-none">
      {/* Visual Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      {/* Dynamic Windows */}
      {windows.map((win) => {
        if (win.isMinimized) return null;
        const isActive = activeWindowId === win.id;

        return (
          <Rnd
            key={win.id}
            size={win.isMaximized ? { width: '100vw', height: 'calc(100vh - 65px)' } : win.size}
            position={win.isMaximized ? { x: 0, y: 0 } : win.position}
            onDragStop={(e, d) => !win.isMaximized && updateWindowBounds(win.id, { x: d.x, y: d.y }, win.size)}
            onResizeStop={(e, dir, ref, delta, pos) =>
              !win.isMaximized && updateWindowBounds(win.id, pos, { width: parseInt(ref.style.width), height: parseInt(ref.style.height) })
            }
            onMouseDown={() => focusWindow(win.id)}
            style={{ zIndex: win.zIndex }}
            className={`fixed flex flex-col rounded-xl overflow-hidden border ${
              isActive ? 'border-cyan-500/80 shadow-2xl shadow-cyan-950/50' : 'border-gray-800'
            } bg-gray-900/95 backdrop-blur-md`}
          >
            {/* Titlebar */}
            <div className="flex justify-between items-center px-4 py-2.5 bg-gray-950 border-b border-gray-800 cursor-move">
              <span className="text-xs font-semibold tracking-wide text-gray-300">{win.title}</span>
              <div className="flex gap-2">
                <button onClick={() => minimizeWindow(win.id)} className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition">
                  <Minus size={14} />
                </button>
                <button onClick={() => maximizeWindow(win.id)} className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition">
                  {win.isMaximized ? <Copy size={14} /> : <Square size={14} />}
                </button>
                <button onClick={() => closeWindow(win.id)} className="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 bg-black overflow-hidden relative">
              {win.url ? (
                <iframe src={win.url} className="w-full h-full border-0 bg-white" title={win.title} allow="autoplay; encrypted-media; picture-in-picture" />
              ) : (
                <div className="flex flex-col h-full bg-gray-950 p-4 text-gray-200">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
                    <Bot className="text-cyan-400" size={20} />
                    <h2 className="text-cyan-400 font-bold text-base">OS Intelligent Agent</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-xs max-w-[85%] ${
                          msg.role === 'assistant'
                            ? 'bg-gray-900 border border-gray-800 text-gray-200 self-start'
                            : 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-200 ml-auto'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a command or ask AI..."
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button onClick={handleSendMessage} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1">
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Rnd>
        );
      })}

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6 py-3 rounded-2xl bg-gray-950/80 border border-gray-800 backdrop-blur-xl shadow-2xl">
        {APPS.map((app) => (
          <button key={app.id} onClick={() => openApp(app)} className="p-2 hover:scale-110 transition duration-150">
            {getIcon(app.icon)}
          </button>
        ))}
      </div>
    </main>
  );
}

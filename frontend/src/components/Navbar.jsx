import React from 'react';
import { RefreshCw, ArrowLeft, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({
  isOnline,
  checkServerHealth,
  selectedAlbum,
  setSelectedAlbum,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedAlbum ? (
            <button
              onClick={() => setSelectedAlbum(null)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Albums</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedAlbum(null)}>
              <img
                src="/logo.jpg"
                alt="PhotoVault Logo"
                className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-sky-500/20 border border-sky-500/30 hover:scale-105 transition"
              />
              <div>
                <h1 className="text-lg font-bold text-white leading-tight flex items-center gap-1.5">
                  PhotoVault
                </h1>
                <p className="text-xs text-slate-400">FastAPI & React Media Manager</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                {currentUser}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="ml-1 text-slate-400 hover:text-rose-400 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 px-3 py-1.5 rounded-lg transition shadow-md shadow-sky-500/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Health status badge */}
          <button
            onClick={checkServerHealth}
            title="Click to check API status"
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition hover:opacity-80"
            style={{
              backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              borderColor: isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
              color: isOnline ? '#34d399' : '#fb7185',
            }}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-semibold hidden sm:inline">
              {isOnline ? 'API Connected' : 'API Disconnected'}
            </span>
            <RefreshCw className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>
    </header>
  );
}

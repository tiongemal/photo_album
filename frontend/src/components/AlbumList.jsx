import React, { useState } from 'react';
import { FolderPlus, Folder, Trash2, Image as ImageIcon, ArrowRight, User, LogIn } from 'lucide-react';

export default function AlbumList({
  albums,
  onSelectAlbum,
  onCreateAlbum,
  onDeleteAlbum,
  currentUser,
  onOpenAuthModal,
  loading,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    try {
      setCreating(true);
      await onCreateAlbum(newAlbumName);
      setNewAlbumName('');
      setIsModalOpen(false);
    } finally {
      setCreating(false);
    }
  };

  // Ensure albums is always an array (handling edge cases from API)
  const albumArray = Array.isArray(albums) ? albums : albums ? [albums] : [];

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Photo Albums</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your photo collections or create a new album
          </p>
        </div>
        <button
          onClick={() => {
            if (!currentUser) {
              onOpenAuthModal();
            } else {
              setIsModalOpen(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Album</span>
        </button>
      </div>

      {/* Album Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800"
            />
          ))}
        </div>
      ) : !currentUser ? (
        <div className="text-center py-16 px-4 bg-slate-800/20 border border-dashed border-slate-800 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
            <LogIn className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-lg font-semibold text-white">Sign In Required</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Please sign in or create an account to view and manage your photo albums.
          </p>
          <button
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition shadow-lg shadow-sky-500/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Access Albums</span>
          </button>
        </div>
      ) : albumArray.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-800/20 border border-dashed border-slate-800 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
            <Folder className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-white">No photo albums yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Get started by creating your first photo album to upload and organize your images.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm px-4 py-2 rounded-xl transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create First Album</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {albumArray.map((album) => (
            <div
              key={album.id}
              className="group relative bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-sky-500/5"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition duration-300">
                    <Folder className="w-6 h-6" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete album "${album.name}"?`)) {
                        onDeleteAlbum(album.id);
                      }
                    }}
                    title="Delete Album"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition line-clamp-1">
                  {album.name}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Owner #{album.owner_id}
                  </span>
                  <span>•</span>
                  <span>Album ID #{album.id}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> View Gallery
                </span>
                <button
                  onClick={() => onSelectAlbum(album)}
                  className="p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-sky-500 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Album Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-sky-400" />
                Create New Album
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Album Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Summer Trip 2026"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newAlbumName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 rounded-xl transition"
                >
                  {creating ? 'Creating...' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

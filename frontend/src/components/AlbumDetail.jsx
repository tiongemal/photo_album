import React, { useState, useEffect } from 'react';
import {
  Upload,
  ArrowLeft,
  Image as ImageIcon,
  Maximize2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { fetchAlbumPhotos, getPhotoUrl } from '../services/api';

export default function AlbumDetail({ album, onBack, onOpenUploadModal, onSelectPhoto }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAlbumPhotos(album.id);
      setPhotos(data);
    } catch (err) {
      setError(err.message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [album.id]);

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {album.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Album ID #{album.id} • Owned by User #{album.owner_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPhotos}
            title="Refresh photos"
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-square rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 text-sm bg-rose-950/20 border border-rose-500/20 rounded-2xl">
          {error}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-800/20 border border-dashed border-slate-800 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-sky-400 flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
            <ImageIcon className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-white">This album is empty</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Upload JPEG, PNG, or WebP images to build your photo collection.
          </p>
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm px-4 py-2 rounded-xl transition shadow-lg shadow-sky-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload First Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-sky-500/60 transition duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/10"
            >
              <img
                src={getPhotoUrl(photo.id)}
                alt={photo.original_filename}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 p-3 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="p-1.5 rounded-full bg-slate-900/80 text-white backdrop-blur">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white truncate">
                    {photo.original_filename}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    {photo.width && photo.height ? `${photo.width}×${photo.height}` : ''}{' '}
                    • {formatBytes(photo.file_size)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

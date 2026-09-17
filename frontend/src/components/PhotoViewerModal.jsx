import React, { useState } from 'react';
import { X, Download, FileText, Maximize2, HardDrive, Info, Trash2, AlertTriangle } from 'lucide-react';
import { getPhotoUrl } from '../services/api';

export default function PhotoViewerModal({ photo, onClose, onDeletePhoto }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!photo) return null;

  const photoUrl = getPhotoUrl(photo.id);

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async () => {
    if (!onDeletePhoto) return;
    try {
      setDeleting(true);
      await onDeletePhoto(photo.id);
      onClose();
    } catch (err) {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full border border-slate-800 backdrop-blur transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview Container */}
        <div className="flex-1 bg-black/60 p-6 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          <img
            src={photoUrl}
            alt={photo.original_filename}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Metadata Details Sidebar */}
        <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Info className="w-4 h-4" /> Photo Details
              </div>
              <h3 className="text-base font-bold text-white break-all leading-snug">
                {photo.original_filename}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Photo ID:</span>
                  <span className="font-semibold text-white">#{photo.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Album ID:</span>
                  <span className="font-semibold text-white">#{photo.album_id}</span>
                </div>
              </div>

              <div className="space-y-2.5 text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Maximize2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-500 text-[11px]">Resolution</p>
                    <p className="font-medium">
                      {photo.width && photo.height
                        ? `${photo.width} × ${photo.height} px`
                        : 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <HardDrive className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-500 text-[11px]">File Size</p>
                    <p className="font-medium">{formatBytes(photo.file_size)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-500 text-[11px]">MIME Format</p>
                    <p className="font-medium">{photo.mime_type}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  Stored UUID Filename
                </p>
                <p className="text-[11px] font-mono text-slate-400 break-all">
                  {photo.stored_filename}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2.5">
            <a
              href={photoUrl}
              target="_blank"
              rel="noreferrer"
              download={photo.original_filename}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-sky-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Image</span>
            </a>

            {confirmDelete ? (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-2">
                <p className="text-[11px] text-rose-300 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  Delete photo permanently?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-semibold py-1.5 rounded-lg transition"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-1.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/30 font-medium text-xs py-2 px-4 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
